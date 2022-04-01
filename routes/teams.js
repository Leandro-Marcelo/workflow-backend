const express = require("express");
const { uploadFile } = require("../libs/storage");
const { isRegular } = require("../middleware/auth");

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

  router.post("/", isRegular, async (req, res) => {
    const team = await teamsService.create(req.user.id, req.body);

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

  router.post("/uploadTest", (req, res) => {
    uploadFile();

    return res.json({ success: true });
  });
}

module.exports = teams;
