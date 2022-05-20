const express = require("express");
const { downloadFile } = require("../libs/storage");

function files(app) {
    const router = express.Router();

    app.use("/files", router);

    /* el frontend haría esta petición para obtener la imagen */
    router.get("/:fileName", (req, res) => {
        /* Ahora tocaría hacerlo dinamico, ya solo sería cuestion de obtener el Content-Type del String que estas leyendo, me parece que cuando se hace el stream, del createReadStream creo que tiene una propiedad para ver de que tipo era originalmente ese contenido. Y ya tocaría hacer el header dinamico */
        /*     const ext = path.extname(fileName); */
        const { fileName } = req.params;
        /*   res.header("Content-Type", "image/jpg"); */
        /* NAAAA, tambien funciona */
        res.header("Content-Type", "octet-stream");
        downloadFile(fileName, res);
    });
}

module.exports = files;
