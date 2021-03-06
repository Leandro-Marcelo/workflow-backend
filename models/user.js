const { mongoose } = require("../config/db");

const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    birthday: Date,
    email: String,
    password: String,
    role: Number,
    /* el nombre del provider, Google, Facebook, Twitter, Github */
    provider: String,
    /* es el id que le asigna el provider */
    idProvider: String,
    /* voy agregar fileKey e image para poder mostrar la foto del usuario en la ui hecha por Lean frontend */
    img: String,
    fileKey: String,
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
