const express= require('express');
const router = express.Router()
const auth = require('../middleware/auth');
const streamer = require('../middleware/streamer');
const mysql = require('mysql');
const database = require('../functions/sql');
const eventFunctions = require('../functions/eventFunctions');
const serverStatsFunctions = require('../functions/serverStatsFunctions');
const { isDevMode } = require('../data/dev.json');



router.get('/minecraft/:token', async (req, res) => {
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

            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders();

            if(isDevMode) console.log(token + ' Connected')
            serverStatsFunctions.updateConnectedTokens(1);

            res.write(`data: {"status":"connected"}\n\n`);

            const keepAliveInterval = setInterval(() => {
                res.write(`Keep Alive\n\n`);
            }, 60000);
            
            const interval = setInterval(() => {

                eventFunctions.sendEvents(req, res, token, 'minecraft');
                
            }, 100);

            res.on('close', () => {
                if(isDevMode) console.log(token + ' Dropped');
                serverStatsFunctions.updateConnectedTokens(-1);
                clearInterval(interval);
                clearInterval(keepAliveInterval);
                res.end();
            });

        } else {
            res.status(401).json({ error:"Invalid Token" });
        }
    });
    
});

module.exports = router;
