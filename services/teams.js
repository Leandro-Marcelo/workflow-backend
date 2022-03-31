const TeamModel = require("../models/teams");

class Teams {
  async create(idLeader, data) {
    /* retira los datos de su objeto original (json enviado por el usuario que contiene name, img, description) y los pone en este nuevo para luego nosotros agregarle propiedades extras como el idLeader y el arreglo de members para que este objeto sea el cual se enviará para crearse en la Data Base */
    const newTeam = { ...data, idLeader, members: [idLeader] };
    const team = await TeamModel.create(newTeam);

    return team;
  }

  async listByUser(idUser) {
    /* await TeamModel.find({idLeader:idLeader}).populate("members") (donde members es un array de usersId) lo que hará es traer el team donde el idLeader sea ese que le enviamos pero ademas traerá todos los datos por cada userId que se encuentre en members como un objeto y que se almacenarán en un array por como estaba definido el modelo. algo así: {idLeader,name,img, members:[{id,name,emai,password},{id,name,email,password}]} esto del populate se utiliza cuando usamos referencias, en algunos casos es útil si es que no tenemos muchos miembros */

    /* Si hacemos await TeamModel.find({idLeader:idLeader}).populate("members").populate("idLeader") algo así: {id, idLeader:{id,name,birthday,email,password}, img, name, members:[{}, {}, {}]}*/

    /* Lo que hace esta query es, va a iterar los teams y va a buscar en cada team si dentro de members, existe un id con este idUser que le pasamos, si coincide almacenará ese objeto en un arreglo */
    const teams = await TeamModel.find({ members: idUser })
      /* el segundo parametro serían las propiedades que queremos, en este caso específicamos que solo name y email */
      .populate("members", "name email")
      .populate("idLeader", "name email");

    return teams;
  }
}

module.exports = Teams;
