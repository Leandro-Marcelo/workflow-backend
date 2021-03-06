const Users = require("./users");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config");
const bcrypt = require("bcrypt");
const { uploadFile } = require("../libs/storage");
// const sendEmail = require("../libs/email")

class Auth {
    constructor() {
        this.users = new Users();
    }

    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    getToken(user) {
        const data = {
            id: user.id,
            name: user.name,
            email: user.email,
            img: user.img ? user.img : "",
            role: user.role ? user.role : 0,
            provider: user.provider ? user.provider : "",
        };
        const token = jwt.sign(data, jwt_secret, { expiresIn: "1d" });
        return { success: true, data, token };
    }

    async login(email, password) {
        if (!email || !password) {
            return { success: false, message: "Ingresa credenciales" };
        }
        const user = await this.users.getByEmail(email);
        if (user) {
            const correctPassword = await bcrypt.compare(
                password,
                user.password
            );
            if (correctPassword) {
                return this.getToken(user);
            } else {
                return {
                    success: false,
                    message: "Las credenciales no coinciden",
                };
            }
        }

        return {
            success: false,
            message: "El email no se encuentra registrado.",
        };
    }

    /* signup con json    
 async signup(userData) {
        if (await this.users.getByEmail(userData.email)) {
            return { succes: false, message: "Usuario ya registrado" };
        } else {
            userData.role = 0;
            userData.password = await this.hashPassword(userData.password);
            const user = await this.users.create(userData);
            // await sendEmail(userData.email,"Registro exitoso","Bienvenido a la aplicaci??n","<a href='http://localhost:4000'><em>Bienvenido</em> a la aplicaci??n</a>")
            return this.getToken(user);
        }
    } */

    async signup(credentials, file) {
        if (!credentials.email || !credentials.password || !credentials.name) {
            return { success: false, message: "Rellena los campos" };
        }

        if (await this.users.getByEmail(credentials.email)) {
            return {
                succes: false,
                message: "Usuario ya registrado con ese email",
            };
        }
        if (await this.users.getByFilter({ name: credentials.name })) {
            return {
                succes: false,
                message: "Usuario ya registrado con ese nombre",
            };
        }

        if (credentials.name.length > 12) {
            return {
                success: false,
                message: "El nombre no puede tener mas de 12 caracteres",
            };
        }
        credentials.password = await this.hashPassword(credentials.password);
        let uploaded;
        if (file) {
            uploaded = await uploadFile(file?.originalname, file?.buffer);
        }
        if (uploaded?.success) {
            const newUser = {
                ...credentials,
                img: "/files/" + uploaded.fileName,
                fileKey: uploaded.fileName,
                role: 10,
            };
            const user = await this.users.create(newUser);

            return this.getToken(user);
        } else {
            const newUser = { ...credentials, role: 10 };
            const user = await this.users.create(newUser);
            return this.getToken(user);
        }
    }

    async loginProvider(profile) {
        let user = await this.users.getByFilter({ idProvider: profile.id });
        if (!user) {
            user = await this.users.create({
                name: profile.displayName,
                email: profile.emails ? profile.emails[0].value : undefined,
                role: 10,
                provider: profile.provider,
                idProvider: profile.id,
                img: profile.photos ? profile.photos[0].value : "",
            });
        }
        return this.getToken(user);
    }
}

module.exports = Auth;
