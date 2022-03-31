const express = require("express");
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

  router.post("/", isRegular, async (req, res) => {
    /* los datos del usuario estan en el req.user porque el middleware decodificó el token del usuario y sus datos lo guardo en req.user */
    const team = await teamsService.create(req.user.id, req.body);

    return res.json(team);
  });
}

module.exports = teams;
