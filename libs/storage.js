const { Storage } = require("@google-cloud/storage");
/* const stream = require("stream"); */
/* Readable tiene eventos como data: data se dispara cuando empieza a recibir datos  end: Cuando se terminan de recibir datos error:  cuando hay un error. Las funciones/métodos mas comunes son: pipe, unpipe, read, push. 

Writable tiene ventos como drain: cuando emitimos/enviando datos, finish: cuando se ha terminado de emitir datos, error: cuando hay un error. Las funciones mas comunes son: write, end */
const { Readable } = require("stream");
const { bucket_name } = require("../config");

/* la configuración para conectarse con el servicio cloud storage */
const storage = new Storage({
  keyFilename: "credentials-gcloud.json",
});

//storage.bucket("archivos_aplicacion").upload("",{})
/* multer es quien nos lo sube en un buffer */
const uploadFile = (fileName, buffer) => {
  //Referencia al objeto de archivo en google cloud
  /* le pone el bucket_name que viene de config, nombre del archivo o como queremos que se llame en cloud storage/google cloud */
  const file = storage.bucket(bucket_name).file(fileName);

  /* entonces gracias a ese buffer, podemos crear un Readable stream para leer a partir de ese buffer  */
  const stream = Readable.from(buffer);

  /* y ahora con ese stream (que es un readable stream) le hacemos un pipe para el writeStream,*/
  stream
    /*  es decir, para cada uno de los datos que tenemos en el Readable Stream los estamos escribiendo en el WriteStream del archivo (file) para crear el archivo de salida y que para cada una de las partes que vamos haciendo stream hacia la nube, se vaya subiendo, es decir, acá en el file.createWrite... va llegando en partecitas, cuando ya llegan todas,  se une todo el archivo  y quedaría solamente el archivo completo a partir del nombre (por eso es muy importante que tengamos el nombre del archivo) */
    .pipe(file.createWriteStream())
    .on("finish", () => {
      console.log("El archivo se ha cargado exitosamente");
    })
    .on("error", (err) => {
      console.log(err);
    });
};

module.exports = { uploadFile };
