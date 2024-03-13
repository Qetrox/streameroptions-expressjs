const mysql = require('mysql');
const database = require('../functions/sql');

function checkIfStreamerIsEnabledOnAccount(req, res, next) {
    const user = req.user;
    database.getPool().query('SELECT * FROM streamer WHERE streamerUserId = ?', [req.user.id], (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.status(500).send();
        }

        if (results[0] !== undefined && results[0].streamerUserId !== undefined) {
            req.streamer = results[0];

            next();
        } else {
            return res.redirect("../../../../../../../../../../../streamer/activate");
        }
    });
}

function checkIfStreamerEnabledAndHasSetUpAccount(req, res, next) {

    const user = req.user;
    database.getPool().query('SELECT * FROM streamer JOIN eventTokens ON tokenUserId = streamerUserId WHERE streamerUserId = ?', [user.id], (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.status(500).send();
        }
        if (results[0] !== undefined && results[0].streamerUserId !== undefined) {
            req.streamer = results[0];

            if (results[0].streamerSlogan !== null && results[0].streamerDescription !== null) {
                next();
            } else {
                return res.redirect("../../../../../../../../../../../streamer/setup");
            }
        } else {
            return res.redirect("../../../../../../../../../../../streamer/activate");
        }
    });
}

module.exports = {
    isStreamerEnabled: checkIfStreamerIsEnabledOnAccount,
    isStreamerSetup: checkIfStreamerEnabledAndHasSetUpAccount,
}