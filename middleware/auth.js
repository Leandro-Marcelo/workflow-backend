const jwt = require("jsonwebtoken");
const {
    jwt_secret,
    callback_url,
    oauth_client_id,
    oauth_client_secret,
    github_client_id,
    github_client_secret,
    /* facebook_app_id,
    facebook_app_secret,
    twitter_consumer_id,
    twitter_consumer_secret, */
} = require("../config");

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy
// const TwitterStrategy = require("passport-twitter").Strategy
/* podríamos agregar login con spotify como lo hizo agustin */

const useGoogleStrategy = () => {
    return new GoogleStrategy(
        {
            clientID: oauth_client_id,
            clientSecret: oauth_client_secret,
            callbackURL: callback_url + "/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            //console.log({accessToken,refreshToken,profile})
            done(null, { profile });
        }
    );
};

/* const useFacebookStrategy = () => {
    return new FacebookStrategy(
        {
            clientID: facebook_app_id,
            clientSecret: facebook_app_secret,
            callbackURL: callback_url + "/auth/facebook/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            //console.log({accessToken,refreshToken,profile})
            done(null, { profile });
        }
    );
}; */

const useGitHubStrategy = () => {
    return new GitHubStrategy(
        {
            clientID: github_client_id,
            clientSecret: github_client_secret,
            callbackURL: callback_url + "/auth/github/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            //console.log({accessToken,refreshToken,profile})
            done(null, { profile });
        }
    );
};

/* const useTwitterStrategy = () => {
    return new TwitterStrategy(
        {
            consumerKey: twitter_consumer_id,
            consumerSecret: twitter_consumer_secret,
            callbackURL: callback_url + "/auth/twitter/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            //console.log({accessToken,refreshToken,profile})
            done(null, { profile });
        }
    );
}; */

// 1

const isAdmin = (req, res, next) => {
    req.neededRole = 30;
    verifyToken(req, res, next);
};

const isEditor = (req, res, next) => {
    req.neededRole = 20;
    verifyToken(req, res, next);
};

const isRegular = (req, res, next) => {
    req.neededRole = 10;
    verifyToken(req, res, next);
};

const isNew = (req, res, next) => {
    req.neededRole = 0;
    verifyToken(req, res, next);
};

// 2
const verifyToken = (req, res, next) => {
    const auth = req.header("Authorization");
    const cookies = req.cookies;

    if (!auth && !cookies.token) {
        return res.status(403).json({
            status: "No-Auth",
            message: "A token is required for this process",
        });
    }

    /* no recuerdo para que era el else, o sea que hacía */
    if (cookies.token) {
        handleToken(cookies.token, req, res, next);
    } else {
        const token = auth.split(" ")[1];
        handleToken(token, req, res, next);
    }
};

// 3
const handleToken = (token, req, res, next) => {
    try {
        const decoded = jwt.verify(token, jwt_secret);
        req.user = decoded;
        return validateRole(req, res, next);
    } catch (error) {
        return res.status(403).json({
            status: "Expired",
            message: "A valid token is required for this process",
        });
    }
};

// 4
const validateRole = (req, res, next) => {
    if (req.user.role >= req.neededRole) {
        return next();
    }

    return res.status(403).json({
        status: "Insuficient permissions",
        message: "A superior role is required for this action",
    });
};

module.exports = {
    isRegular,
    isAdmin,
    isEditor,
    useGoogleStrategy,
    useGitHubStrategy,
    // useFacebookStrategy,
    // useTwitterStrategy
};
