const TaskModel = require("../models/tasks");
const ListService = require("./lists");
const CommentService = require("./comments");

class Tasks {
    constructor() {
        /* define esto así para que no tener que poner users = new Users() y luego utilizar el método users.getByEmail, pero esto tendría que ponerlo tanto en login como en signup (basicamente para no repetir código) ====>  this.users = new Users(); ... Lo malo de esto es que si tengo importado el servicio de task en el servicio de lists, no puedo importar el servicio de lists en task */
        /* this.comments = new CommentService(); */
    }
    /* podríamos agregar un populate para traer los datos de quien comentó, al menos de definir otra ruta y que los comentarios esten ocultos que al momento de clickear, haga un consumi de la api y pida recien los comentarios */
    async get(id) {
        const result = await TaskModel.findById(id)
            .populate({
                path: "comments",
                populate: { path: "idUser", model: "users" },
            })
            .populate("assigned", "name email");
        /* usuarios a los cuales puede asignar tareas */
        /*  const filteredUsers = await Tas; */

        return result;
    }

    async create(data) {
        /* validacion si existe la lista, ya que sino puede crear tareas a una lista que no existe, validar tambien la url? */
        /* podríamos validar de que la tarea tenga titulo, una descripcion etc etc */
        /* un error podria no asignarle la tarea a nadie xd */
        const taskCreated = await TaskModel.create(data);
        return taskCreated;
    }
    async update(id, data) {
        const result = await TaskModel.findByIdAndUpdate(id, data, {
            new: true,
        });

        return result;
    }

    async delete(id) {
        const taskDeleted = await TaskModel.findByIdAndDelete(id);
        if (taskDeleted) {
            return { success: true, taskDeleted };
        }
        return { success: false, message: "Task does not exist" };
    }

    /* los que comentan deben pertenecer al team y deben ser editor, validator o leader, no otros con rol normal a pesar de que no puedan ver otras lista, igual en caso de querer no debería dejarles el backend */
    /* el idUser lo pasa separado del commentData porque este lo obtiene del token del usuario cuando esta logeado, es decir, (cuando uno crea un comentario no pone su id en la base de datos porque no lo sabe xd) */
    async addComment(idTask, user, commentData, file) {
        const commentService = new CommentService();
        const comment = await commentService.create(
            idTask,
            user.id,
            commentData,
            file
        );
        const result = await TaskModel.updateOne(
            { _id: idTask },
            { $push: { comments: comment.id } },
            { new: true }
        );
        return { comment, user };
    }
    async removeComment(idTask, idComment) {
        const commentService = new CommentService();
        const comment = await commentService.delete(idComment);
        const result = await TaskModel.updateOne(
            { _id: idTask },
            { $pull: { comments: idComment } },
            { new: true }
        );
        return comment;
    }
}

module.exports = Tasks;
