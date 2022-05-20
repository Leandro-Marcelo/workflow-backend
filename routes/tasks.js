const express = require("express");
const { isRegular } = require("../middleware/auth");
const upload = require("../middleware/upload");
const Tasks = require("../services/tasks");

function tasks(app) {
    const router = express.Router();

    const taskService = new Tasks();

    app.use("/tasks", router);
    /* *********************** Task Folder *********************** */
    router.get("/:idTask", isRegular, async (req, res) => {
        const task = await taskService.get(req.params.idTask, req.user);

        return res.json(task);
    });

    router.put("/:idTask", isRegular, async (req, res) => {
        const task = await taskService.update(req.params.idTask, req.body);
        return res.json(task);
    });
    /* ******************************************************* */

    /* ************************* Comment Folder *********************** */
    /* Add Comment */
    router.post(
        "/:idTask/addComment",
        isRegular,
        upload.single("file"),
        async (req, res) => {
            const result = await taskService.addComment(
                req.params.idTask,
                req.user,
                req.body,
                req.file
            );
            return res.json(result);
        }
    );

    /* Delete Comment */
    /* le quite el isRegular isRegular, */
    router.delete("/:idTask/removeComment/:idComment", async (req, res) => {
        const comment = await taskService.removeComment(
            req.params.idTask,
            req.params.idComment
        );

        return res.json(comment);
    });

    /* *********************************************************** */
}

module.exports = tasks;
