const express = require("express");
const { isRegular } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { downloadFile } = require("../libs/storage");
const Teams = require("../services/teams");

function teams(app) {
    const router = express.Router();
    app.use("/teams", router);

    const teamsService = new Teams();

    router.get("/", isRegular, async (req, res) => {
        const teams = await teamsService.listByUser(req.user.id);
        return res.json(teams);
    });

    router.get("/:id", isRegular, async (req, res) => {
        const team = await teamsService.get(req.params.id);
        return res.json(team);
    });

    /* el frontend haría esta petición para obtener la imagen */
    router.get("/file/:fileName", (req, res) => {
        const { fileName } = req.params;

        downloadFile(fileName, res);
    });

    /* OJO importante el orden de los middleware, primero verifico si es un usuario Regular y recién pasa al middleware de subir el archivo */
    /* el single es para decirle que solamente vamos a recibir un único archivo/imagen (y esto es por multer), si nosotros lo vamos a enviar desde form-data como image, acá debe ir image, si queremos subir multiples archivos sería .array */
    router.post("/", isRegular, upload.single("img"), async (req, res) => {
        /* esto nos dice que tipo de archivo es req.file.mimetype() nos puede servir para validar que sea una imagen */
        /* el archivo/imagen se encuentra en req.file porque multer lo pone ahí */
        const team = await teamsService.create(req.user.id, req.body, req.file);

        return res.json(team);
    });

    /* para hacer esto, acá ya deberiamos tener permisos, inclusive en este caso podríamos recibir un token tipo: /addMember/:token que ya contenga toda la información como, idUser, idLeader, idTeam, todo, de hecho, hacerlo como la otra vez añadir al correo el token y cuando se clickee el link se acepte la invitación, y que ya se añada al equipo  */
    /* acá lo tomo del body para hacerlo mas rápido */
    router.post("/addMember", async (req, res) => {
        const team = await teamsService.addMember(
            req.body.idTeam,
            req.body.idNewMember
        );

        return res.json(team);
    });
    router.post("/changeRole", async (req, res) => {
        const team = await teamsService.changeRole(
            req.body.idTeam,
            req.body.idMember,
            req.body.newRole
        );

        return res.json(team);
    });

    router.delete("/removeMember", async (req, res) => {
        const team = await teamsService.deleteMember(
            req.body.idTeam,
            req.body.idMember
        );

        return res.json(team);
    });
}

module.exports = teams;
