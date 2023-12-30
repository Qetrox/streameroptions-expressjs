const express= require('express');
const router = express.Router()
const mysql = require('mysql');
const database = require('../functions/sql');
const serverStatsFunctions = require('../functions/serverStatsFunctions');
const { admin } = require('../data/roles.json');
const cors = require('cors')

router.get('/twitch/activated-modules', cors(), (req, res) => {
    if(req.query.u === undefined || req.query.u === '') {
        res.status(400).send('No user specified');
        return;
    }
    const con = mysql.createConnection(database.getDatabaseCredentials());
    con.connect();
    con.query('SELECT event_data FROM StreamerEvents JOIN events ON StreamerEventId = event_id WHERE is_enabled = 1 and EventStreamerUserId = ?', [req.query.u], (err, result) => {
        con.end();
        if(err) {
            res.status(500).send('Internal Server Error');
            console.log(err);
            return;
        }
        const responseJSON = JSON.parse('[]');
        for(let i = 0; i < result.length; i++) {
            const newData = JSON.parse(result[i].event_data);
            delete newData["description"];
            responseJSON.push(newData);
        }
        res.send(responseJSON);
    });
});


module.exports = router;
