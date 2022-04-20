const { mongoose } = require("../config/db");

const { Schema } = mongoose;

const taskSchema = new Schema(
    {
        /* para mí en la tarea tambien se tendría que poder el subir un archivo, tipo nombre, description y file */
        idList: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "lists",
        },
        author: String,
        name: String,
        description: String,
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "comments",
            },
        ],
        assigned: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            },
        ],
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const TaskModel = mongoose.model("tasks", taskSchema);

module.exports = TaskModel;
