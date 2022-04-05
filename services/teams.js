const TeamModel = require("../models/teams");
/* si podemos importar otros servicios, lo que no podemos es importar el modelo de otro servicio */
/* Esta bien importar un servicio a otro, porque hay servicios que dependen de otros lo que si no se puede hacer, es importar el Modelo del otro servicio, porque cada modelo debería tener su propio servicio que se encargue de la lógica de la aplicación, si cambia luego el modelo o algo así, ya el servicio se actualiza y así los otros servicios que dependian de este servicio ya no sufrirían ningun cambio  */
/* tambien por el tema de validaciones, si yo hago validaciones al momento de crear una tarea, los demas servicios que la consuman no tendrían que repetir código es decir, si importaran el modelo las mismas validaciones que hice en el servicio mismo tendrían que ponerlo donde lo fueran a utilizar y eso no es práctico. Hago todas las validaciones del servicio con su modelo así las demas no tienen que hacerlo y solo consumir */
const ListService = require("./lists");
const { uploadFile } = require("../libs/storage");

class Teams {
    async update(id, data) {
        const team = await TeamModel.findByIdAndUpdate(id, data, { new: true });

        return team;
    }

    async delete(id) {
        const team = await TeamModel.findByIdAndDelete(id);

        return team;
    }

    async create(idLeader, data, file) {
        /* console.log(`file ori..:`, file?.originalname);
        console.log(`file.buffer:`, file?.buffer); */
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
                members: [{ _id: idLeader }],
            };
            const team = await TeamModel.create(newTeam);

            return team;
        } else {
            const newTeam = { ...data, idLeader, members: [{ _id: idLeader }] };
            const team = await TeamModel.create(newTeam);
            return team;
        }
    }

    /* Al momento mostrar idLeader, mongoose va a tomar el valor de ese idLeader y lo va almacenar en una propiedad llamada _id, pero no le esta creando un _id sino crea la propiedad y le pone el valor que ingresó el usuario (al momento de crear un team), esto lo hace porque va a utilizar ese _id para hacer las subconsultas en la colletion de users y así ponerle abajo las propiedades de name y email, todo esto porque estamos utilizando populate, ya que si vieramos idLeader en la base de datos sería idLeader:192938219321 y su id basicamente */
    async listByUser(idUser) {
        const teams = await TeamModel.find({
            members: { $elemMatch: { _id: idUser } },
        })
            /* como ahora en el objeto que van dentro del array son tipo así: members:[{_id:1312321,role:"normal"}], tendríamos que acceder al _id como si fuera un objeto de JS*/
            .populate("members._id", "name email")
            .populate("idLeader", "name email");

        return teams;
    }

    /* Show the members, Leader, lists,  */
    async get(idTeam) {
        const team = await TeamModel.find({ _id: idTeam })
            .populate("members._id", "name email")
            .populate("idLeader", "name email")
            .populate({
                path: "lists",
                populate: { path: "tasks", model: "tasks" },
            });
        /* tomo el primer elemento del array porque me lo devuelve en array y ademas sé que solamente existe 1 por lo tanto, se va almacenar ahí */
        return team[0];
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
            /* le decimos que queremos actualizar, va a iterar el array de members y va a filtrar donde el_.id:idMember (donde el valor de la propiedad _id sea igual a idMember) y a ese member va a ingresar a su propiedad role y se lo va a reasignar por este newRole */
            { $set: { "members.$[el].role": newRole } },
            { arrayFilters: [{ "el._id": idMember }] }
        );
        /* otra forma de verlo sería   { $set: { "members.$[el]": {role:newRole} } },*/
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
}

module.exports = Teams;
