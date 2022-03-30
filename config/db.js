/* En las bases de datos relacionales, la collections sería la tabla y los objetos serían las filas */
const mongoose = require("mongoose");
/* importa las variables de configuracion que realizamos en /config/index.js */
/* aquí pongo (".") esto porque JS esta configurado para traer por defecto el index */
const config = require(".");

const connection = async () => {
  const conn = await mongoose.connect(
    `mongodb+srv://${config.db_username}:${config.db_password}@${config.db_host}/${config.db_name}`
  );

  console.log("Mongo DB connected", conn.connection.host);
};

module.exports = { connection, mongoose };
