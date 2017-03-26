module.exports = function (mongoose) {
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
        tags: [String]
    }, { versionKey: false });

    note.set("toJSON", {
        transform: function (document, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    });

    return {
        Note: mongoose.model("notes", note)
    };
};