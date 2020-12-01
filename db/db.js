module.exports = function () {
    const mongoose = require("mongoose");

    var note = () => {
        var note = mongoose.Schema({
            preview: {
                type: String,
                required: true,
                default: ""
            },
            text: {
                type: String,
                required: true,
                default: ""
            },
            owners: [String],
            tags: [String]
        });

        note.set("toJSON", {
            transform: function (document, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        });

        return mongoose.model("notes", note);
    }

    var user = () => {
        var user = mongoose.Schema({
            name: String,
            google: String
        }, { versionKey: false });

        user.set("toJSON", {
            transform: function (document, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        });

        return mongoose.model("users", user);
    }

    var log = () => {
        var log = mongoose.Schema({
            date: Date,
            message: String
        }, { versionKey: false });

        return mongoose.model("log", log);
    }

    let init = async (connectionString) => {
        mongoose.Promise = Promise;
        await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    return {
        Log: log(),
        Note: note(),
        User: user(),
        init: init
    };
}();