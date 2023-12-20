const express= require('express');
const router = express.Router()
const auth = require('../middleware/auth');
const streamer = require('../middleware/streamer');
const mysql = require('mysql');
const database = require('../functions/sql');
const eventFunctions = require('../functions/eventFunctions');
const serverStatsFunctions = require('../functions/serverStatsFunctions');
const { admin } = require('../data/roles.json');
const e = require('express');

router.get('/devMonitorStats/:token', (req, res) => {
    const con = mysql.createConnection(database.getDatabaseCredentials());

    const token = req.params.token

    con.connect();
    con.query('select * from eventTokens where token = ?', [token], (error, results, fields) => {
        con.end();
        if(error) {
            res.status(500).send();
            return;
        }
        if(results[0] !== undefined && results[0].tokenUserId !== undefined && results[0].tokenUserId !== null) {
            if(admin.includes(results[0].tokenUserId)) {
                res.json(
                    serverStatsFunctions.getStatisticsCounts()
                    );
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(401);
        }
    });
});

router.get('/devMonitor', auth.authCookie, (req, res) => {
    if(admin.includes(req.user.id)) {

        const con = mysql.createConnection(database.getDatabaseCredentials());
        con.connect();
        con.query('select * from eventTokens where tokenUserId = ?', [req.user.id], (error, results, fields) => {
            con.end();
            if (error) {
                console.error(error);
                return;
            }

            res.render(
                'dev/monitor',
                { 
                    WebsiteTitleElementText: webTitle + ' - Dev Monitor',
                    hostname: hostname,
                    CssUrl: 'devStyle1.css',
                    startTime: serverStatsFunctions.getStartTime(),
                    statistics: serverStatsFunctions.getStatisticsCounts(),
                    eventToken: results[0].token,
                }
                );
        });
    } else {
        res.redirect('../../../');
    }
});

module.exports = router;
