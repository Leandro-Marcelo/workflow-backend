const { mongoose } = require("../config/db");

const { Schema } = mongoose;

const teamSchema = new Schema({
    idLeader: {
        type: mongoose.Schema.Types.ObjectId,
        /* estos ref hacen referencia a como se llama el otro modelo, basicamente la línea 15 del modelo de users lo dice, nombre del modelo y el esquema esos dos parametros pasa, tambien es como se llama en mongodb */
        ref: "users",
    },
    /* tendríamos que hacer el nombre del equipo único no? Creo que no porque en nuestro discord por ejemplo, somos el team cmamut y en otro país puede que haya un equipo igual xd, pero no porque nosotros nos llamamos así ellos no pueden xd */
    name: String,
    /* este sería el nombre del archivo como esta en google cloud  */
    fileKey: String,
    /* y este ya es la ruta para descargar el archivo  */
    img: String,
    description: String,
    /* como los datos del arreglo son objetos (porque digo que son objetos porque habre llaves y no son para la configuración del dato sino que dentro tiene dos propiedades _id y role y en cada uno de estos recién habre las llaves para su configuración), mongoose le va a intentar crear un _id, para evitar eso a una propiedad le asigna de nombre  _id ya que si le pone simplemente id, le crea un _id (y quedaría con un id y un _id xd) */
    /* Como en un team puede haber varios miembros, entonces hacemos un array, si solamente un miembro podría haber por team entonces quitariamos el array */
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
    /* Como en un team puede haber varias listas, entonces hacemos un array, si solamente una lista podría haber por team entonces quitariamos el array */
    lists: [
        /* este no es un objeto que va en el array por eso no le crea un _id, simplemente esta configurando que tipo de dato es y la refs (en otras palabras con la notación de un JSON esta haciendo la configuración del dato, donde puede específicar si es required, min,max,ref,type, etc. En cambio arriba si es un array de objetos) */
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "lists",
        },
    ],
});

const TeamModel = mongoose.model("teams", teamSchema);

module.exports = TeamModel;
