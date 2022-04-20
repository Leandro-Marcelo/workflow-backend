const { mongoose } = require("../config/db");

const { Schema } = mongoose;

const commentSchema = new Schema({
    idTask: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tasks",
    },
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    file: String,
    fileKey: String,
    content: String,
    fileName: String,
    created_date: {
        type: Date,
        default: new Date(),
        /* para que sirve el immutable */
        immutable: true,
    },
});

const CommentModel = mongoose.model("comments", commentSchema);

module.exports = CommentModel;
