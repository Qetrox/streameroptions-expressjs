const express= require('express');
const router = express.Router()
const auth = require('../middleware/auth');
const streamer = require('../middleware/streamer');
const mysql = require('mysql');
const database = require('../functions/sql');
const crypto = require('crypto');


router.get('/dashboard', auth.authCookie, streamer.isStreamerSetup, async (req, res) => {

    let con = mysql.createConnection(database.getDatabaseCredentials());
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

        con = mysql.createConnection(database.getDatabaseCredentials());
        con.connect();
        con.query('SELECT * FROM customMinecraftEvents WHERE streamerId = ?', [req.streamer.streamerUserId], (error, results, fields) => {
            con.end();
            if(error) {
                console.error(error);
                return res.status(500).send();
            }

            res.render('streamer_dashboard', 
            { 
                WebsiteTitleElementText: `${webTitle} - Dashboard`,
                hostname: hostname,
                CssUrl: '../../stylesheet2.css',
                modules: events,
                slogan: req.streamer.streamerSlogan,
                description: req.streamer.streamerDescription,
                customMinecraftModules: results,
                token: req.streamer.token,
            }
            );
        });
    });
});

router.get('/save-modules', auth.authCookie, streamer.isStreamerSetup, async (req, res) => {
    let enabled = 0;
    if(req.query === undefined || req.query === null) return res.redirect('./dashboard');
    try {
        const con = mysql.createConnection(database.getDatabaseCredentials());
        con.connect();
        if(req.query.toggled != undefined && req.query.toggled == 'on') enabled = 1;
        con.query('insert into StreamerEvents (EventStreamerUserId, StreamerEventId, is_enabled, event_cost) values (?, ?, ?, ?) ON DUPLICATE KEY UPDATE is_enabled = ?, event_cost = ?', [req.streamer.streamerUserId, req.query.module_id, enabled, req.query.price, enabled, req.query.price], (error, results, fields) => {
            con.end();
            if(error) {
                console.error(error);
                return res.status(500).send();
            }
        });
    } catch (err) {
        console.error(error);
        return res.status(500).send();
    }
    res.redirect('./dashboard');
});
router.get('/save-custom-minecraft-modules', auth.authCookie, streamer.isStreamerSetup, async (req, res) => {
    if(req.query === undefined || req.query === null) return res.redirect('./dashboard');
    let enabled1 = 0;
    let enabled2 = 0;
    let enabled3 = 0;
    let enabled4 = 0;
    let enabled5 = 0;
    let inputEnabled1 = 0;
    let inputEnabled2 = 0;
    let inputEnabled3 = 0;
    let inputEnabled4 = 0;
    let inputEnabled5 = 0;

    if(req.query.toggled1 != undefined && req.query.toggled1 == 'on') enabled1 = 1;
    if(req.query.toggled2 != undefined && req.query.toggled2 == 'on') enabled2 = 1;
    if(req.query.toggled3 != undefined && req.query.toggled3 == 'on') enabled3 = 1;
    if(req.query.toggled4 != undefined && req.query.toggled4 == 'on') enabled4 = 1;
    if(req.query.toggled5 != undefined && req.query.toggled5 == 'on') enabled5 = 1;
    if(req.query.inputtoggled1 != undefined && req.query.inputtoggled1 == 'on') inputEnabled1 = 1;
    if(req.query.inputtoggled2 != undefined && req.query.inputtoggled2 == 'on') inputEnabled2 = 1;
    if(req.query.inputtoggled3 != undefined && req.query.inputtoggled3 == 'on') inputEnabled3 = 1;
    if(req.query.inputtoggled4 != undefined && req.query.inputtoggled4 == 'on') inputEnabled4 = 1;
    if(req.query.inputtoggled5 != undefined && req.query.inputtoggled5 == 'on') inputEnabled5 = 1;

    if(req.query.price1 == undefined || req.query.price1 == null || req.query.price1 == '') req.query.price1 = 0;
    if(req.query.price2 == undefined || req.query.price2 == null || req.query.price2 == '') req.query.price2 = 0;
    if(req.query.price3 == undefined || req.query.price3 == null || req.query.price3 == '') req.query.price3 = 0;
    if(req.query.price4 == undefined || req.query.price4 == null || req.query.price4 == '') req.query.price4 = 0;
    if(req.query.price5 == undefined || req.query.price5 == null || req.query.price5 == '') req.query.price5 = 0;

    const con = mysql.createConnection(
        database.getDatabaseCredentials(true), 
    );

    con.connect();
    try {
        con.query(
            'insert into customMinecraftEvents (streamerId, streamerEventId, eventName, eventDescription, eventCommandString, eventCost, inputPlaceholder, inputEnabled, isEnabled) values (?, 1, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE eventName = ?, eventDescription = ?, eventCommandString = ?, eventCost = ?, inputPlaceholder = ?, inputEnabled = ?, isEnabled = ?; ' +
            'insert into customMinecraftEvents (streamerId, streamerEventId, eventName, eventDescription, eventCommandString, eventCost, inputPlaceholder, inputEnabled, isEnabled) values (?, 2, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE eventName = ?, eventDescription = ?, eventCommandString = ?, eventCost = ?, inputPlaceholder = ?, inputEnabled = ?, isEnabled = ?; ' +
            'insert into customMinecraftEvents (streamerId, streamerEventId, eventName, eventDescription, eventCommandString, eventCost, inputPlaceholder, inputEnabled, isEnabled) values (?, 3, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE eventName = ?, eventDescription = ?, eventCommandString = ?, eventCost = ?, inputPlaceholder = ?, inputEnabled = ?, isEnabled = ?; ' +
            'insert into customMinecraftEvents (streamerId, streamerEventId, eventName, eventDescription, eventCommandString, eventCost, inputPlaceholder, inputEnabled, isEnabled) values (?, 4, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE eventName = ?, eventDescription = ?, eventCommandString = ?, eventCost = ?, inputPlaceholder = ?, inputEnabled = ?, isEnabled = ?; ' +
            'insert into customMinecraftEvents (streamerId, streamerEventId, eventName, eventDescription, eventCommandString, eventCost, inputPlaceholder, inputEnabled, isEnabled) values (?, 5, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE eventName = ?, eventDescription = ?, eventCommandString = ?, eventCost = ?, inputPlaceholder = ?, inputEnabled = ?, isEnabled = ?; ',
            [
                req.streamer.streamerUserId, req.query.title1, req.query.description1, req.query.command1, req.query.price1, req.query.viewerinputplaceholder1, inputEnabled1, enabled1, req.query.title1, req.query.description1, req.query.command1, req.query.price1, req.query.viewerinputplaceholder1, inputEnabled1, enabled1,
                req.streamer.streamerUserId, req.query.title2, req.query.description2, req.query.command2, req.query.price2, req.query.viewerinputplaceholder2, inputEnabled2, enabled2, req.query.title2, req.query.description2, req.query.command2, req.query.price2, req.query.viewerinputplaceholder2, inputEnabled2, enabled2,
                req.streamer.streamerUserId, req.query.title3, req.query.description3, req.query.command3, req.query.price3, req.query.viewerinputplaceholder3, inputEnabled3, enabled3, req.query.title3, req.query.description3, req.query.command3, req.query.price3, req.query.viewerinputplaceholder3, inputEnabled3, enabled3,
                req.streamer.streamerUserId, req.query.title4, req.query.description4, req.query.command4, req.query.price4, req.query.viewerinputplaceholder4, inputEnabled4, enabled4, req.query.title4, req.query.description4, req.query.command4, req.query.price4, req.query.viewerinputplaceholder4, inputEnabled4, enabled4,
                req.streamer.streamerUserId, req.query.title5, req.query.description5, req.query.command5, req.query.price5, req.query.viewerinputplaceholder5, inputEnabled5, enabled5, req.query.title5, req.query.description5, req.query.command5, req.query.price5, req.query.viewerinputplaceholder5, inputEnabled5, enabled5,
                ],
            (error, results, fields) => {
                con.end();
                if(error) {
                    console.error(error);
                    return res.status(500).send();
                }
            }
        );
    } catch (err) {
        console.error(error);
        return res.status(500).send();
    }

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
        WebsiteTitleElementText: `${webTitle} - Setup`,
        hostname: hostname,
        CssUrl: '../../stylesheet5.css'
    }
    );
});

module.exports = router;