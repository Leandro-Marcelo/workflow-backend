const express = require("express");
const cors = require("cors");
const cookies = require("cookie-parser");
const config = require("./config");

//Importando routers
const auth = require("./routes/auth");
const teams = require("./routes/teams");
const files = require("./routes/files");
const lists = require("./routes/lists");
const tasks = require("./routes/tasks");
const users = require("./routes/users");
const comments = require("./routes/comments");

/* si hacemos una query y no hemos registrado ninguna lista pero queremos probarla, podemos ponerla en index y así por lo menos nos devuelve un array vacio en el campo lists 
const ListModel = require("../models/lists"); */

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:3000/teams",
            "http://localhost:3001",
            "https://leandro-marcelo.github.io",
        ],
        credentials: true,
    })
);

app.use(cookies());

const { connection } = require("./config/db");
connection();

// Utilizando las rutas
auth(app);
teams(app);
files(app);
lists(app);
tasks(app);
users(app);
comments(app);

app.get("/", (req, res) => {
    res.status(200).send(
        "Hola, Soy Leandro Marcelo y este es mi API REST de mi Workflow App"
    );
});

app.listen(config.port, () => {
    /*  console.log("Mode:", process.env.NODE_ENV);
    console.log("listening on: http://localhost:" + config.port); */
});
