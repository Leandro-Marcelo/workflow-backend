const nodemailer = require("nodemailer");
const {
    email_host,
    email_port,
    email_secure,
    email_user,
    email_password,
} = require("../config");

/* creamos un transporte con los datos del .env, es quien nos permite enviar el email, que haga la conexión con todas las demas partes. */
/* basicamente esto es como cuando hacemos una conexión con la base de datos */
const transporter = nodemailer.createTransport({
    host: email_host,
    port: email_port,
    secure: email_secure,
    auth: {
        user: email_user,
        pass: email_password,
    },
});

/* hacía quién || título || contenido || y el html es contenido en html que queramos enviar al usuario */
async function sendEmail(to, subject, text, html) {
    let info = await transporter.sendMail({
        /* si el correo no lo tenemos verificado, lo marcará como spam */
        from: "lmarcelos2019@gmail.com",
        to,
        subject,
        text,
        html,
    });
    /* 
{
  accepted: [ 'yucranico0@gmail.com' ],  // a sido aceptado
  rejected: [], // no a sido rechazado
  envelopeTime: 415,
  messageTime: 317,
  messageSize: 626,
  response: '250 Ok: queued as 4QilXm2mRluhKgexOAjNqg',
  envelope: { from: 'lmarcelos2019@gmail.com', to: [ 'yucranico0@gmail.com' ] },
  messageId: '<afe23d85-eb7a-9f42-dae2-f1b1363226c9@gmail.com>'
}
*/
    console.log(info);

    return { success: true };
}

module.exports = sendEmail;
