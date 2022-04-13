const express = require("express");
const UserService = require("../services/users");
const { isRegular } = require("../middleware/auth");

const users = (app) => {
    const router = express.Router();
    const userService = new UserService();

    app.use("/users", router);

    router.get("/", async (req, res) => {
        const users = await userService.getAll();

        return res.json(users);
    });

    router.get("/:idUser", async (req, res) => {
        const user = await userService.get(req.params.idUser);

        return res.json(user);
    });

    router.put("/:idUser", isRegular, async (req, res) => {
        const user = await userService.update(req.params.idUser, req.body);
        return res.json(user);
    });
};

module.exports = users;
