require("dotenv").config();

const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    jwt_secret: process.env.JWT_SECRET,
    // Mongo
    db_username: process.env.DB_USERNAME,
    db_password: process.env.DB_PASSWORD,
    db_host: process.env.DD_HOST,
    db_name: process.env.DB_NAME,
    // Passport
    callback_url: process.env.NODE_ENV
        ? process.env.CALLBACK_URL_DEVELOPMENT + ":" + process.env.PORT
        : process.env.CALLBACK_URL,
    oauth_client_id: process.env.OAUTH_CLIENT_ID,
    oauth_client_secret: process.env.OAUTH_CLIENT_SECRET,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    // Sendgrid
    /* no lo tenía porque lo aprendí en el backend del IMDB, es decir, en mi primer api rest backend con mongoose */
    email_host: process.env.EMAIL_HOST,
    email_port: process.env.EMAIL_PORT,
    email_secure: process.env.EMAIL_SECURE,
    email_user: process.env.EMAIL_USER,
    email_password: process.env.EMAIL_PASSWORD,
    // Files
    bucket_name: process.env.BUCKET_NAME,
};
module.exports = config;
