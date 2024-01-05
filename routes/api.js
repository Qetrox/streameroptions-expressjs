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
    let con = mysql.createConnection(database.getDatabaseCredentials());
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

        con = mysql.createConnection(database.getDatabaseCredentials());
        con.connect();
        con.query('SELECT * FROM customMinecraftEvents WHERE isEnabled = 1 AND streamerId = ?', [req.query.u], (err, result) => {
            con.end();
            if(err) {
                res.status(500).send('Internal Server Error');
                console.log(err);
                return;
            }
            for(let i = 0; i < result.length; i++) {
                const newData = JSON.parse(`{"title":"${result[i].eventName}"}`);
                
                responseJSON.push(newData);
            }
            res.send(responseJSON);
        });

    });
});

router.get('/twitch/point-leaderboard', cors(), (req, res) => {
    if(req.query.u === undefined || req.query.u === '') {
        res.status(400).send('No user specified');
        return;
    }
    let con = mysql.createConnection(database.getDatabaseCredentials());
    con.connect();
    con.query('SELECT points, userDisplayname FROM points JOIN users ON viewerId = userId WHERE userUsername IS NOT NULL AND streamerId = ? AND viewerId != ? ORDER BY points DESC LIMIT 200', [req.query.u, req.query.u], (err, result) => {
        con.end();
        if(err) {
            res.status(500).send('Internal Server Error');
            console.log(err);
            return;
        }
        const responseJSON = JSON.parse('[]');
        for(let i = 0; i < result.length; i++) {
            responseJSON.push({ "username": result[i].userDisplayname, "points": result[i].points });
        }

        res.send(responseJSON);

    });
});

router.get('/twitch/watchtime-leaderboard', cors(), (req, res) => {
    if(req.query.u === undefined || req.query.u === '') {
        res.status(400).send('No user specified');
        return;
    }
    let con = mysql.createConnection(database.getDatabaseCredentials());
    con.connect();
    con.query('SELECT totalPoints, userDisplayname FROM points JOIN users ON viewerId = userId WHERE userUsername IS NOT NULL AND streamerId = ? AND viewerId != ? ORDER BY totalPoints DESC LIMIT 200', [req.query.u, req.query.u], (err, result) => {
        con.end();
        if(err) {
            res.status(500).send('Internal Server Error');
            console.log(err);
            return;
        }
        const responseJSON = JSON.parse('[]');
        for(let i = 0; i < result.length; i++) {
            responseJSON.push({ "username": result[i].userDisplayname, "watchtime": Math.round(result[i].totalPoints / 10) });
        }

        res.send(responseJSON);

    });
});


module.exports = router;
