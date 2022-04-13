const express = require("express");
const { isRegular } = require("../middleware/auth");
const upload = require("../middleware/upload");
const Teams = require("../services/teams");

function teams(app) {
    const router = express.Router();
    app.use("/teams", router);

    const teamsService = new Teams();

    /* Shows a specific team with their members */
    /* solo deberia traer las listas y tareas, los comentarios se cargarían despues al clickear seguramente */
    router.get("/:id", isRegular, async (req, res) => {
        const team = await teamsService.get(req.params.id);
        return res.json(team);
    });

    /* displays the members of the teams (also the Leader) you belong to  */
    router.get("/", isRegular, async (req, res) => {
        const teams = await teamsService.listByUser(req.user.id);
        return res.json(teams);
    });

    /* OJO importante el orden de los middleware, primero verifico si es un usuario Regular y recién pasa al middleware de subir el archivo */
    /* el single es para decirle que solamente vamos a recibir un único archivo/imagen (y esto es por multer), si nosotros lo vamos a enviar desde form-data como image, acá debe ir image, si queremos subir multiples archivos sería .array */
    /* esto se envia usando form-data y no un json, algo a saber es que por defecto form-data sería lo que enviaría un formulario , ya por defecto en el body se procesa, no necesitamos ningún middleware para parsearle como lo haciamos con json utilizando el middleware express.json() */
    router.post("/", isRegular, upload.single("img"), async (req, res) => {
        /* esto nos dice que tipo de archivo es req.file.mimetype() nos puede servir para validar que sea una imagen */
        /* el archivo/imagen se encuentra en req.file porque multer lo pone ahí */
        const team = await teamsService.create(req.user.id, req.body, req.file);
        if (team.success) {
            return res.status(200).json(team);
        }
        return res.status(401).json(team);
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

    /* Update a Team */
    router.put("/:idTeam", async (req, res) => {
        const team = await teamsService.update(req.params.idTeam, req.body);

        return res.json(team);
    });

    router.delete("/removeMember", async (req, res) => {
        const team = await teamsService.deleteMember(
            req.body.idTeam,
            req.body.idMember
        );

        return res.json(team);
    });

    router.delete("/:idTeam", async (req, res) => {
        const team = await teamsService.delete(req.params.idTeam);
        return res.json(team);
    });

    /* ************** List Folder ****************** */
    /* esto va en team porque necesitamos el id del team para agregar la lista y registrarla */
    /* leandro puede crearle una lista a un team al cual no pertenece, agregar validación, lo correcto sería que solamente los que son editores o leader en el equipo pueden crear listas pero dentro de ese team al cual pertenecen */
    router.post("/:idTeam/addList", async (req, res) => {
        const list = await teamsService.addList(req.params.idTeam, req.body);

        return res.json(list);
    });

    /* pasamos también el idTeam porque al eliminar la lista, tendríamos que hacerle un pull quitando ese id de la lista que fue eliminada en el modelo de Team */
    router.delete("/:idTeam/removeList/:idList", async (req, res) => {
        const list = await teamsService.removeList(
            req.params.idTeam,
            req.params.idList
        );

        return res.json(list);
    });
    /* *********************************************** */
}

module.exports = teams;
