const express= require('express');
const router = express.Router()
const auth = require('../middleware/auth');
const streamer = require('../middleware/streamer');
const mysql = require('mysql');
const database = require('../functions/sql');
const crypto = require('crypto');


router.get('/dashboard', auth.authCookie, streamer.isStreamerSetup, async (req, res) => {

    const con = mysql.createConnection(database.getDatabaseCredentials());
    con.connect();

    con.query('SELECT * FROM events LEFT JOIN StreamerEvents ON event_id = StreamerEventId AND StreamerEvents.EventStreamerUserId = ?', [req.streamer.streamerUserId], (error, results, fields) => {
        con.end();
        if(error) {
            console.error(error);
            return res.status(500).send();
        }

        let events = {
        };

        for(i = 0; i < results.length; i++) {
            const jsonObject = JSON.parse(results[i].event_data);
            if (events[results[i].event_type] === undefined) {
                events[results[i].event_type] = [];
            }

            if (results[i].event_cost === null)  results[i].event_cost = 0;

            events[results[i].event_type].push(
                {
                    title: jsonObject.title,
                    description: jsonObject.description,
                    price: results[i].event_cost,
                    m_id: results[i].event_id,
                    enabled: results[i].is_enabled
                }
            )    
        
        }

        res.render('streamer_dashboard', 
        { 
            WebsiteTitleElementText: `${webTitle} - Dashboard`,
            hostname: hostname,
            CssUrl: '../../stylesheet2.css',
            modules: events,
            slogan: req.streamer.streamerSlogan,
            description: req.streamer.streamerDescription,
            token: req.streamer.token,
        }
        );

    });
});

router.get('/save-modules', auth.authCookie, streamer.isStreamerSetup, async (req, res) => {
    const con = mysql.createConnection(database.getDatabaseCredentials());
    con.connect();
    let enabled = 0;
    if(req.query === undefined || req.query === null) return res.redirect('./dashboard');

    if(req.query.toggled != undefined && req.query.toggled == 'on') enabled = 1;
    con.query('insert into StreamerEvents (EventStreamerUserId, StreamerEventId, is_enabled, event_cost) values (?, ?, ?, ?) ON DUPLICATE KEY UPDATE is_enabled = ?, event_cost = ?', [req.streamer.streamerUserId, req.query.module_id, enabled, req.query.price, enabled, req.query.price], (error, results, fields) => {
        con.end();
        if(error) {
            console.error(error);
            return res.status(500).send();
        }
    });
    res.redirect('./dashboard');
});

router.get('/setup', auth.authCookie, streamer.isStreamerEnabled, async (req, res) => {
    res.render('streamer_setup', 
    { 
        WebsiteTitleElementText: `${webTitle} - Setup`,
        hostname: hostname,
        CssUrl: '../../stylesheet6.css',
        slogan: req.streamer.streamerSlogan,
        description: req.streamer.streamerDescription,
    }
    );
});

router.post('/setup', auth.authCookie, streamer.isStreamerEnabled, express.urlencoded({extended: true}), async (req, res) => {

    try {
        const slogan = req.body.slogan;
        const description = req.body.description;

        const con = mysql.createConnection(database.getDatabaseCredentials());

        con.connect();
        con.query('UPDATE streamer SET streamerSlogan = ?, streamerDescription = ? WHERE streamerUserId = ?', [slogan, description, req.user.id], (error, results, fields) => {
            con.end();
            if (error) {
                console.error(error);
                return res.status(500).send();
            }
            res.redirect('dashboard')
        });

    if(description.length == 0 && slogan.length == 0) res.redirect('/setup');

    } catch (err) {
        console.log(err)
        res.redirect('/setup');
    }




});

router.post('/activate', auth.authCookie, express.urlencoded({extended: true}), async (req, res) => {
    
    const confirm = req.body.confirm;
    if(confirm === 'Enable') {
        let con = mysql.createConnection(database.getDatabaseCredentials());

        const date = new Date();

        con.connect();
        con.query('INSERT IGNORE INTO streamer (streamerUserId, streamerActiveSince) VALUES (?, ?)', [req.user.id, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`], (error, results, fields) => {
            con.end();
            if (error) {
                console.error(error);
                return res.status(500).send();
            }

            crypto.randomBytes(64, function (ex, buf) {
                con = mysql.createConnection(database.getDatabaseCredentials());
                con.connect();
                con.query('INSERT IGNORE INTO eventTokens (token, tokenUserId) VALUES (?, ?)', [`${req.user.id}-${buf.toString('hex')}`, req.user.id], (error, results, fields) => {
                    con.end();
                    if (error) {
                        console.error(error);
                        return res.status(500).send();
                    }
                    res.redirect('dashboard')
                });    
            });
        });
    }
});

router.get('/activate', auth.authCookie, async (req, res) => {
    res.render('streamer_activate',
    { 
        WebsiteTitleElementText: `${webTitle} - Dashboard`,
        hostname: hostname,
        CssUrl: '../../stylesheet5.css'
    }
    );
});

module.exports = router;