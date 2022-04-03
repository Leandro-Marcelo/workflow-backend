const express = require("express");
const { isRegular } = require("../middleware/auth");

const Lists = require("../services/lists");

function lists(app) {
    const router = express.Router();

    const listService = new Lists();

    app.use("/lists", router);

    /* ************** List Folder ************* */
    /* Updating a list */
    router.put("/:idList", isRegular, async (req, res) => {
        const list = await listService.update(req.params.idList, req.body);
        return res.json(list);
    });

    /* *************************************** */

    /* ************** Task Folder ************* */
    /* Add a task */
    router.post("/:idList/addTask", isRegular, async (req, res) => {
        const result = await listService.addTask(req.params.idList, req.body);
        return res.json(result);
    });

    /* Remove a task */
    router.delete(
        "/:idList/removeTask/:idTask",
        isRegular,
        async (req, res) => {
            const task = await listService.removeTask(
                req.params.idList,
                req.params.idTask
            );

            return res.json(task);
        }
    );

    /* ************************************* */
}

module.exports = lists;