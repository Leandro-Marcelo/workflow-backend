const TeamModel = require("../models/teams");
/* si podemos importar otros servicios, lo que no podemos es importar el modelo de otro servicio */
/* Esta bien importar un servicio a otro, porque hay servicios que dependen de otros lo que si no se puede hacer, es importar el Modelo del otro servicio, porque cada modelo debería tener su propio servicio que se encargue de la lógica de la aplicación, si cambia luego el modelo o algo así, ya el servicio se actualiza y así los otros servicios que dependian de este servicio ya no sufrirían ningun cambio  */
/* tambien por el tema de validaciones, si yo hago validaciones al momento de crear una tarea, los demas servicios que la consuman no tendrían que repetir código es decir, si importaran el modelo las mismas validaciones que hice en el servicio mismo tendrían que ponerlo donde lo fueran a utilizar y eso no es práctico. Hago todas las validaciones del servicio con su modelo así las demas no tienen que hacerlo y solo consumir */
const ListService = require("./lists");
const UserService = require("./users");
const { uploadFile } = require("../libs/storage");

class Teams {
    /* Al momento mostrar idLeader, mongoose va a tomar el valor de ese idLeader y lo va almacenar en una propiedad llamada _id, pero no le esta creando un _id sino crea la propiedad y le pone el valor que ingresó el usuario (al momento de crear un team), esto lo hace porque va a utilizar ese _id para hacer las subconsultas en la colletion de users y así ponerle abajo las propiedades de name y email, todo esto porque estamos utilizando populate, ya que si vieramos idLeader en la base de datos sería idLeader:192938219321 y su id basicamente */

    async getTeams(idUser) {
        const teams = await TeamModel.find({
            members: { $elemMatch: { _id: idUser } },
        });

        return teams;
    }

    async getTeam(idTeam, userId) {
        const team = await TeamModel.find({ _id: idTeam })
            .populate("members._id", "name email img role")
            .populate("idLeader", "name email")
            .populate({
                path: "lists",
                populate: { path: "tasks", model: "tasks" },
            });

        const user = team[0].members.filter(
            (member) => String(member._id._id) === userId
        );

        /* tomo el primer elemento del array porque me lo devuelve en array y ademas sé que solamente existe 1 por lo tanto, se va almacenar ahí */
        return { team: team[0], userRole: user[0].role };
    }

    async update(id, data) {
        const team = await TeamModel.findByIdAndUpdate(id, data, { new: true });

        return team;
    }

    async delete(id) {
        const team = await TeamModel.findByIdAndDelete(id);

        return team;
    }

    async create(idLeader, data, file) {
        if (data.name === "") {
            return {
                success: false,
                message: "El nombre del equipo es requerido",
            };
        }

        let uploaded;
        if (file) {
            uploaded = await uploadFile(file?.originalname, file?.buffer);
            /* al momento de subir el archivo, guardar eso mismo en el modelo de archivos para luego utilizarlo al momento de gestionar los permisos */
        }
        if (uploaded?.success) {
            const newTeam = {
                ...data,
                /* algo bastante util es hacer el archivo publico, para que directamente ya podamos obtener la URL y directamente en el frontend no tengamos que configurar otra ruta para leer del archivo */
                /* es obligatorio pasar todo el path incluyendo la extensión del archivo porque es la key que utiliza cloud storage, ya que podría ver otro archivo que se llame igual y que tenga otra extensión como mp4 etc etc */
                img: "/files/" + uploaded.fileName,
                fileKey: uploaded.fileName,
                idLeader,
                members: [{ _id: idLeader, role: "leader" }],
            };
            const team = await TeamModel.create(newTeam);

            return { success: true, team };
        } else {
            const newTeam = {
                ...data,
                idLeader,
                members: [{ _id: idLeader, role: "leader" }],
            };
            const team = await TeamModel.create(newTeam);
            return { success: true, team };
        }
    }

    async addMember(idTeam, idNewMember) {
        const result = await TeamModel.updateOne(
            /* primero específico el team donde quiero agregar el member */
            { _id: idTeam },
            /* luego decido la acción que en este caso es push (pull es para quitar), luego le digo la propiedad, y por último paso el objeto que tendrá como propiedad _id:idNewMember */
            { $push: { members: { _id: idNewMember } } }
        );
        return result;
    }

    async changeRole(idTeam, idMember, newRole) {
        const result = await TeamModel.updateOne(
            /* le pasamos el id del team que queremos actualizar */
            { _id: idTeam },
            //le decimos que queremos actualizar, va a iterar el array de members y va a filtrar donde el_.id:idMember (donde el valor de la propiedad _id sea igual a idMember) y a ese member va a ingresar a su propiedad role y se lo va a reasignar por este newRole
            { $set: { "members.$[el].role": newRole } },
            { arrayFilters: [{ "el._id": idMember }] }
        );
        //otra forma de verlo sería   { $set: { "members.$[el]": {role:newRole} } },
        return result;
    }

    async deleteMember(idTeam, idMember) {
        /* ojo, acá seguiría siendo updatedOne porque estamos retirando un elemento del arreglo y no eliminando el objeto entero de mongoose */
        const result = await TeamModel.updateOne(
            /* le pasamos el id del team que queremos actualizar */
            { _id: idTeam },
            /* existe pullAll por si queremos eliminar muchos miembros que coincidan */
            /* luego le específico la acción, luego la propiedad, y por último le digo que me busque entre los objetos que estan en el array members, el _id que contenga este idMember */
            { $pull: { members: { _id: idMember } } }
        );
        return result;
    }

    async addList(idTeam, listData) {
        /* para no tener que estar instanciando podemos hacerlo en el constructor */
        const listService = new ListService();
        const list = await listService.create(listData);
        /* No agregamos validaciones para el resultado, si se modificó correctamente, se agrego y todo */
        const result = await TeamModel.updateOne(
            { _id: idTeam },
            { $push: { lists: list.id } }
        );
        return list;
    }

    async removeList(idTeam, idList) {
        /* para no tener que estar instanciando podemos hacerlo en el constructor */
        const listService = new ListService();
        const list = await listService.delete(idList);
        const result = await TeamModel.updateOne(
            { _id: idTeam },
            { $pull: { lists: idList } }
        );
        return list;
    }
    /* quizas no debería ir en team */
    async getFilteredUsers(usersId) {
        const userService = new UserService();
        const filteredUsers = await userService.filteredUsers(usersId);
        return filteredUsers;
    }

    async viewMembersByRole(idTeam, role) {
        const team = await TeamModel.findOne({ _id: idTeam }).populate({
            path: "members._id",
            select: "-password -role -__v",
        });
        /*         const user = team.members.filter(
            (member) => String(member._id._id) === userId
        ); */

        // una validación sería si, user[0].role no existe, entonces no haga nada y ponerlo como middleware como hizo valentin, isMember?
        //creo que esto sería mas facil si fueran roles con números xd, ya que sería, simplemente todos los usuarios que tengan menor rol que el xd sin incluirlo por lo que sería less than simplemente

        if (role === "leader") {
            const filter = team.members.filter(
                (member) => member.role !== "leader"
            );

            return filter;
        }

        if (role === "editor") {
            const filter = team.members.filter(
                (member) => member.role !== "leader" && member.role !== "editor"
            );

            return filter;
        }
        if (role === "validator") {
            const filter = team.members.filter(
                (member) =>
                    member.role !== "leader" &&
                    member.role !== "editor" &&
                    member.role !== "validator"
            );

            return filter;
        }
        if (role === "normal") {
            return [];
        }

        return team;
    }
}

module.exports = Teams;
