const { mongoose } = require("../config/db");

const { Schema } = mongoose;

const teamSchema = new Schema({
    idLeader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    name: String,
    /* este sería el nombre del archivo como esta en google cloud  */
    fileKey: String,
    /* y este ya es la ruta para descargar el archivo  */
    img: String,
    description: String,
    /* creo que al ser un arreglo, mongoose le va a intentar crear un _id, por eso le pone de nombre _id en el objeto */
    members: [
        {
            /* acá le pone de nombre _id porque si le pone id solamente, la database le va a crear un _id */
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            },
            role: {
                type: String,
                enum: ["editor", "validator", "normal", "leader"],
                default: "normal",
            },
        },
    ],
    lists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "lists",
        },
    ],
});

const TeamModel = mongoose.model("teams", teamSchema);

module.exports = TeamModel;
