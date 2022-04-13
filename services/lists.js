const ListModel = require("../models/lists");

const TaskService = require("./tasks");

class Lists {
    /* Hacer un read de listas no haría falta porque las listas ya se listarian/leerian con los team, sin embargo, hacer un get para validar si la lista existe si nos serviría */

    async get(idList) {
        try {
            /* returns null if it does not match anyone */
            const list = await ListModel.findById(idList).populate("tasks");
            if (list) {
                return { success: true, list };
            }
            return { success: false, message: "List does not exist" };
        } catch (error) {
            /* podría gestionarlo despues como aprendí */
            return { success: false, error };
        }
    }

    async create(data) {
        const result = await ListModel.create(data);

        return result;
    }
    async update(id, data) {
        const result = await ListModel.findByIdAndUpdate(id, data, {
            new: true,
        });
        const response = await this.get(id);

        return response;
    }

    async delete(id) {
        const result = await ListModel.findByIdAndDelete(id);

        return result;
    }

    async addTask(idList, taskData) {
        if (idList !== taskData.idList) {
            return {
                success: false,
                message: "The id params does not match the idList of the data",
            };
        }

        const list = await this.get(idList);
        if (list.success) {
            const taskService = new TaskService();
            const task = await taskService.create(taskData);
            const listUpdated = await ListModel.updateOne(
                { _id: idList },
                { $push: { tasks: task.id } }
            );
            return task;
        }
        return list;
    }

    async removeTask(idList, idTask) {
        const taskService = new TaskService();
        const result = await taskService.delete(idTask);
        if (result.success) {
            console.log(`entra acá`);
            console.log(idTask);
            const listUpdated = await ListModel.updateOne(
                { _id: idList },
                { $pull: { tasks: idTask } }
            );
            /* return the deleted list*/
            return result;
        }
        return result;
    }
}

module.exports = Lists;
