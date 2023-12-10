require('dotenv').config({ path: '../.env' });
const jwt = require('jsonwebtoken');
const authFunctions = require('../functions/authFunctions')
const database = require('../functions/sql');
const mysql = require('mysql');


/**
 * Middleware function to check if a user is authenticated using a JWT token in the header
 * @param {object} req - The express request object
 * @param {object} res - The express response object
 * @param {Function} next - The express next function
 * @returns {void}
 */
function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        next();
    });
}
/**
 * Middleware function to check if a user is authenticated using a JWT token in a cookie
 * @param {object} req - The express request object
 * @param {object} res - The express response object
 * @param {Function} next - The express next function
 * @returns {void}
 */
function authCookie(req, res, next) {
    let token;
    let refreshToken;

    try {
        token = req.cookies.token;
        refreshToken = req.cookies.refreshtoken;
    } catch (err){
        return res.redirect("../");
    }

    try {

        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = user;
        next();

    } catch (err) {
        try { // probeer refresh token te gebruiken
            
            if(authFunctions.checkRefreshToken(refreshToken)) {
                res.clearCookie("token");
                res.clearCookie("refreshtoken");
                return res.redirect("../../../../../../../../login");
            }

            user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const accessToken = authFunctions.genToken({ user: user.name, id: user.id, display_name: user.display_name });

            res.cookie('token', accessToken, { expires: new Date(Date.now() + 60*60*24*30*1000) })
            req.user = user;
            next();

        } catch (err) {
            res.clearCookie("token");
            res.clearCookie("refreshtoken");
            return res.redirect("../../../../../../../../login");
        }
    }
}

/**
 * Middleware function to check if a user is authenticated using a JWT token in a cookie, but allow users that are not logged in to pass
 * @param {object} req - The express request object
 * @param {object} res - The express response object
 * @param {Function} next - The express next function
 * @returns {void}
 */
function authViewer(req, res, next) {

    const streamerNameID = req.params.id;

    const con = mysql.createConnection(database.getDatabaseCredentials());

    con.connect();

    con.query('SELECT * FROM streamer JOIN users ON streamerUserId = userId WHERE userUsername = ?', [streamerNameID], (error, results) => {
        con.end();
        if (error) {
            console.error(error);
            res.status(500).send();
        }

        if (results[0] !== undefined && results[0].userId !== undefined) {
            let token;
            let refreshToken;

            try {
                token = req.cookies.token;
                refreshToken = req.cookies.refreshtoken;
            } catch (err){
                next();
                return;
            }

            try {

                const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                req.user = user;
                next();
                return;

            } catch (err) {
                try { // probeer refresh token te gebruiken
                    
                    if(authFunctions.checkRefreshToken(refreshToken)) {
                        res.clearCookie("token");
                        res.clearCookie("refreshtoken");
                        next();
                    }

                    user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                    const accessToken = authFunctions.genToken({ user: user.name, id: user.id, display_name: user.display_name });

                    res.cookie('token', accessToken, { expires: new Date(Date.now() + 60*60*24*30*1000) })
                    req.user = user;
                    next();
                    return;

                } catch (err) {
                    res.clearCookie("token");
                    res.clearCookie("refreshtoken");
                    next();
                    return;
                }
            }
        }
        next();
        return;
    });
}

module.exports = { 
    authToken: authToken,
    authCookie: authCookie,
    authViewer: authViewer,
};