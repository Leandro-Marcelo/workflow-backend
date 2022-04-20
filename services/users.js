const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
class Users {
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async get(id) {
        const user = await UserModel.findById(id);
        return user;
    }

    async getByEmail(email) {
        if (email) {
            const user = await UserModel.findOne({ email: email });
            return user;
        }
    }

    async getByFilter(filter) {
        const user = await UserModel.findOne(filter);
        return user;
    }

    async getAll() {
        // find devuelve varios elementos
        const users = await UserModel.find();
        return users;
    }

    async create(data) {
        const user = await UserModel.create(data);
        return user;
    }

    /* id del usuario de la sesión, id del usuario a editar y la data a modificar de ese usuario anterior, lo normal sería que cada vez que se actualiza, debe poner su password, en este caso si actualiza la contraseña, hasheamos esa contraseña, y si no la actualiza la dejamos tal cual */
    async update(loggedUserId, userId, data) {
        /* Este if es para validar si esta editando su cuenta, es decir, el envía su id y si el id que quiere editar es igual a su id entonces se cumple y procede a editarse en la base de datos ó si es admin, entonces tambien*/
        /* cuando agreguemos rol, este tendría que ser un ó loggedUserId === userId || data.isAdmin */
        if (loggedUserId === userId) {
            if (data.password) {
                data.password = await this.hashPassword(data.password);
            }
        } else {
            return {
                success: false,
                message: "You can update only your account!",
            };
        }
        const updatedUser = await UserModel.findByIdAndUpdate(userId, data, {
            new: true,
        });
        return {
            success: true,
            updatedUser,
            message: "Account has been updated",
        };
    }

    async delete(id) {
        const user = await UserModel.findByIdAndDelete(id);
        return user;
    }

    /* importante desestructurarlo porque viene así: { membersId: ["daspldsapa", "dsapldsapas"] } */
    async filteredUsers({ membersId }) {
        const users = await UserModel.find({
            _id: { $nin: membersId },
        });
        return users;
    }
}

module.exports = Users;
