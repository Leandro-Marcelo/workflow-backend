/* este middleware nos sirve para transformar lo que viene en el form-data, principalmente los archivos, es decir, para procesar los archivos necesitamos multer  */
/* Aprender que hace multer */
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

module.exports = upload;
