const TeamModel = require("../models/teams");

class Teams {
  async create(idLeader, data) {
    const newTeam = { ...data, idLeader, members: [{ _id: idLeader }] };
    const team = await TeamModel.create(newTeam);

    return team;
  }
  /* displays the members of the teams you belong to  */
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

  /* Shows a specific team with their members */
  async get(idTeam) {
    const team = await TeamModel.find({ _id: idTeam })
      .populate("members._id", "name email")
      .populate("idLeader", "name email");
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
}

module.exports = Teams;
