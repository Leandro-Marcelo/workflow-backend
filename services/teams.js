const TeamModel = require("../models/teams");

class Teams {
  async create(idLeader, data) {
    const newTeam = { ...data, idLeader, members: [idLeader] };
    const team = await TeamModel.create(newTeam);

    return team;
  }
  // async create(leader,data){
  //     const newTeam = {...data,leader:{
  //         id:leader.id,
  //         name:leader.name,
  //         email:leader.email
  //     },members:[
  //         {
  //             id:leader.id,
  //             name:leader.name,
  //             email:leader.email
  //         }
  //     ]}
  //     const team = await TeamModel.create(newTeam)

  //     return team
  // }

  async listByUser(idUser) {
    /* Recordar que nuestro backend va a estar desplegado en google cloud y este va a interactuar con la Data Base de mongodb atlas, entonces una ventaja de utilizar populate es que desde el backend haría solamente una petición y ya la DB se encargaría de encontrar los team del idUser y de rellenear los datos de name email por cada miembro, etc etc pero solo haríamos una consulta a la base de datos, cosa que si lo hacemos manual serían muchas consultas de google cloud a mongodbatlas*/
    const teams = await TeamModel.find({ members: idUser })
      .populate("members", "name email")
      .populate("idLeader", "name email");

    return teams;
  }
  // async listByUser(id){
  /* Va a iterar los teams y va a retornarme donde dentro de members hagan match con este id */
  //     const teams = await TeamModel.find({members:{  $elemMatch:{id} }})

  //     return teams
  // }
}

module.exports = Teams;
