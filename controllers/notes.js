module.exports = (app) => {
    const db = require("../db/db.js");
    const authenticateUser = require("../common/authenticateUser.js");

    app.get("/api/notes", authenticateUser, async (request, response) => {
        let notes = await db.Note.find({ owners: request.user }, "_id preview tags");
        response.status(200).json({ results: notes });
    });

    app.post("/api/notes", authenticateUser, async (request, response) => {
        let note = new db.Note(request.body);
        note.owners = [request.user];
        let index = note.text.indexOf("\n");
        note.preview = index === -1 ? note.text : note.text.slice(0, index);
        await note.save();
        response.status(201).json({ id: note._id });
    });

    app.get("/api/notes/:id", authenticateUser, async (request, response) => {
        let note = await db.Note.findOne({ _id: request.params.id, owners: request.user }, "_id text tags")
        note ? response.status(200).json(note) : response.status(404).end();
    });

    app.put("/api/notes/:id", authenticateUser, async (request, response) => {
        let index = request.body.text.indexOf("\n");
        request.body.preview = request.body.text.slice(0, index);
        let result = await db.Note.update({ _id:request.params.id, owners: [request.user] }, request.body);
        return response.status(result.n === 1 ? 204 : 404).end();
    });

    app.delete("/api/notes/:id", authenticateUser, async (request, response) => {
        let commandResult = await db.Note.remove({ _id: request.params.id, owners: request.user });
        commandResult.n === 1 ? response.status(204).end() : response.status(404).end();
    });
}
