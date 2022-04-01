const { Storage } = require("@google-cloud/storage");
const stream = require("stream");
/* Readable tiene eventos como data: data se dispara cuando empieza a recibir datos  end: Cuando se terminan de recibir datos error:  cuando hay un error. Las funciones/métodos mas comunes son: pipe, unpipe, read, push. 

Writable tiene ventos como drain: cuando emitimos/enviando datos, finish: cuando se ha terminado de emitir datos, error: cuando hay un error. Las funciones mas comunes son: write, end */
/* const { Readable } = require("stream"); */
const { bucket_name } = require("../config");

const storage = new Storage({
  keyFilename: "credentials-gcloud.json",
});

//storage.bucket("archivos_aplicacion").upload("",{})

const uploadFile = (fileName, buffer) => {
  //Referencia al objeto de archivo en google cloud
  /* le pone el bucket_name que viene de config, nombre del archivo o como queremos que se llame en cloud storage/google cloud */
  const file = storage.bucket(bucket_name).file("prueba.txt");

  /* el PassThrought es quien se encarga de lo que recibimos por el stream de tipo Readable, pasarlo al stream de tipo Writable, mientras vamos recibiendo el Readable stream, vamos escribiendo el Writable stream */
  const passthroughStream = new stream.PassThrough();
  passthroughStream.write("el contenido del archivo");
  /* passthroughStream.write(stream); */
  /* evento de cuando finaliza */
  passthroughStream.end();

  /* creo que pipe es quien envia el coso */
  passthroughStream
    .pipe(file.createWriteStream())
    .on("finish", () => {
      console.log("El archivo se ha cargado exitosamente");
    })
    .on("error", (err) => {
      console.log(err);
    });

  /* const stream = Readable.from(buffer); */

  /*   stream
    .pipe(file.createWriteStream())
    .on("finish", () => {
      console.log("El archivo se ha cargado exitosamente");
    })
    .on("error", (err) => {
      console.log(err);
    }); */
};

module.exports = { uploadFile };
