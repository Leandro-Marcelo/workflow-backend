const { Storage } = require("@google-cloud/storage");
const { Readable } = require("stream");
const { bucket_name } = require("../config");
const uuid = require("uuid");
const path = require("path");

/* la configuración para conectarse con el servicio cloud storage */
const storage = new Storage({
  keyFilename: "credentials-gcloud.json",
});

/* al fileName hay que modificarle el nombre porque si una persona me sube un archivo con el mismo nombre de un archivo ya subido por otra persona, este lo reemplaza */
/* multer es quien nos lo sube en un buffer */
const uploadFile = (fileName, buffer) => {
  /* con esto obtengo la extension del archivo, ex, jpge/png/mp4 etc */
  const ext = path.extname(fileName);
  /* creamos un uuid.v4 y lo únicos con la ext y ese será el nombre del archivo que será subido a cloud storage */
  const uuidFileName = uuid.v4() + ext;

  //Referencia al objeto de archivo en google cloud
  /* le pone el bucket_name que viene de config, nombre del archivo o como queremos que se llame en cloud storage/google cloud */
  const file = storage.bucket(bucket_name).file(uuidFileName);

  /* entonces gracias a ese buffer, podemos crear un Readable stream para leer a partir de ese buffer  */
  const stream = Readable.from(buffer);

  return new Promise((resolve, reject) => {
    /* y ahora con ese stream (que es un readable stream) le hacemos un pipe para el writeStream,*/
    stream
      /*  es decir, para cada uno de los datos que tenemos en el Readable Stream los estamos escribiendo en el WriteStream del archivo (file) para crear el archivo de salida y que para cada una de las partes que vamos haciendo stream hacia la nube, se vaya subiendo, es decir, acá en el file.createWrite... va llegando en partecitas, cuando ya llegan todas,  se une todo el archivo  y quedaría solamente el archivo completo a partir del nombre (por eso es muy importante que tengamos el nombre del archivo) */
      .pipe(file.createWriteStream())
      .on("finish", () => {
        resolve({
          success: true,
          message: "File uploaded succesfully",
          fileName: uuidFileName,
        });
      })
      .on("error", (err) => {
        console.log(err);
        reject({ success: false, message: "An error ocurred" });
      });
  });
};
const downloadFile = (fileName, res) => {
  //Referencia al objeto de archivo en google cloud
  const file = storage.bucket(bucket_name).file(fileName);

  const stream = file.createReadStream();

  stream
    .pipe(res)
    .on("finish", () => {
      console.log("Descargado exitosamente");
    })
    .on("error", (err) => {
      console.log(err);
    });
};

module.exports = { uploadFile, downloadFile };

// Streams: Manuel Alexander
