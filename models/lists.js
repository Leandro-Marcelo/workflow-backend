const { mongoose } = require("../config/db");

const { Schema } = mongoose;

const listSchema = new Schema({
    /* el id Team no sería necesario, al menos que lo consultemos individualmente */
    idTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teams",
    },
    name: String,
    description: String,
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "tasks",
        },
    ],
});

const ListModel = mongoose.model("lists", listSchema);

module.exports = ListModel;
