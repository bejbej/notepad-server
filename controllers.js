module.exports = (app, schema) => {
    var handleError = (response, reason, message, code) => {
        console.log("ERROR: " + reason);
        response.status(code || 500).json({ "error": message });
    }

    app.get("/api/cat", (request, response) => {
        response.status(200).json({ cat: "~(=^..^)" });
    });

    app.get("/api/notes", (request, response) => {
        schema.Note.find({}, "_id preview tags").then(notes => {
            response.status(200).json({ results: notes });
        }, error => {
            handleError(response, error.message, "Failed to find notes.");
        });
    });

    app.post("/api/notes", (request, response) => {
        var note = new schema.Note(request.body);
        note.preview = request.body.text.split("\n")[0];
        note.save().then(() => {
            response.status(201).json({ id: note._id });
        }, error => {
            handleError(response, error.message, "Failed to save note.");
        });
    });

    app.get("/api/notes/:id", (request, response) => {
        schema.Note.findById(request.params.id, "_id text tags").then(note => {
            response.status(200).json(note);
        }, error => {
            handleError(response, error.message, "Failed to get note.");
        });
    });

    app.put("/api/notes/:id", (request, response) => {
        request.body.preview = request.body.text.split("\n")[0];
        schema.Note.findByIdAndUpdate(request.params.id, request.body).then(() => {
            response.status(204).end();
        }, error => {
            handleError(response, error.message, "Failed to update note.");
        });
    });

    app.delete("/api/notes/:id", (request, response) => {
        schema.Note.findByIdAndRemove(request.params.id).then(() => {
            response.status(204).end();
        }, error => {
            handleError(response, error.message, "Failed to delete note.");
        });
    });
}
