const express= require('express');
const router = express.Router()
const streamer = require('../middleware/streamer');
const mysql = require('mysql');
const database = require('../functions/sql');
const eventFunctions = require('../functions/eventFunctions');
const authFunctions = require('../functions/authFunctions');
const auth = require('../middleware/auth');
const checkPoints = require('../functions/checkPoints');
const { isDevMode } = require('../data/dev.json');

router.get('/', (req, res) => {

    let con = mysql.createConnection(database.getDatabaseCredentials());

    con.connect();

    con.query('SELECT * FROM streamer JOIN users ON streamerUserId = userId LIMIT 50', async (error, results, fields) => {
        con.end();
        if (error) {
            console.error(error); 
            res.status(500).send();
        }

        res.render(
            'home', 
            { 
                WebsiteTitleElementText: webTitle,
                hostname: hostname,
                CssUrl: 'stylesheet1.css',
                featured_streamer_list: results
            }
        );

    });
});

router.get('/disclaimer', (req, res) => {
    res.render(
        'legal/disclaimer', 
        { 
            WebsiteTitleElementText: webTitle + ' - Disclaimer',
            hostname: hostname,
            CssUrl: 'stylesheet8.css'
        }
    );
});

router.get('/cookies', (req, res) => {
    res.render(
        'legal/cookies', 
        { 
            WebsiteTitleElementText: webTitle + ' - Cookies',
            hostname: hostname,
            CssUrl: 'stylesheet8.css'
        }
    );
});

router.get('/privacy', (req, res) => {
    res.render(
        'legal/privacy', 
        { 
            WebsiteTitleElementText: webTitle + ' - Privacy Policy',
            hostname: hostname,
            CssUrl: 'stylesheet8.css'
        }
    );
});

router.get('/terms', (req, res) => {
    res.render(
        'legal/terms', 
        { 
            WebsiteTitleElementText: webTitle + ' - Terms of Service',
            hostname: hostname,
            CssUrl: 'stylesheet8.css'
        }
    );
});

router.get('/logout', (req, res) => {
    res.clearCookie("token");
    res.clearCookie("refreshtoken");
    res.redirect("../login")
});

router.get('/login', (req, res) => {
    res.render(
        'login', 
        { 
            WebsiteTitleElementText: webTitle + ' - Login',
            hostname: hostname,
            CssUrl: 'stylesheet4.css'
        }
    );
});

router.get('/viewer', auth.authCookie, (req, res) => {


    const viewerId = req.user.id;
    let con = mysql.createConnection(database.getDatabaseCredentials());
    con.connect();
    con.query('SELECT * FROM points JOIN streamer ON streamerUserId = streamerId JOIN users ON streamerUserId = userId WHERE points.viewerId = ?', [viewerId], (error, results, fields) => {
        con.end();
        if(error) {
            console.error(error);
            return res.status(500).send();
        }
        res.render(
            'viewer_home', 
            { 
                WebsiteTitleElementText: webTitle + ' - Viewer Home',
                hostname: hostname,
                CssUrl: 'stylesheet7.css',
                streamer_points: results
            }
        );
    });
});	

router.get('/streamers', (req, res) => {

    let con = mysql.createConnection(database.getDatabaseCredentials());

    con.connect();

    con.query('SELECT * FROM streamer JOIN users ON streamerUserId = userId', async (error, results, fields) => {
        con.end();
        if (error) {
            console.error(error); 
            res.status(500).send();
        }

        res.render(
            'streamers', 
            { 
                WebsiteTitleElementText: webTitle + ' - Streamers',
                hostname: hostname,
                CssUrl: 'stylesheet9.css',
                streamer_list: results
            }
        );

    });
});

router.post('/:id', auth.authViewer, express.urlencoded({extended: true}), (req, res) => {
    const streamerNameID = req.params.id;
    let viewerName;

    if(req.user === undefined || req.user.display_name === undefined) {
        viewerName = 0;
    } else {
        viewerName = req.user.display_name;
    }

    if(viewerName != req.body.redeemed_by) {
        res.status(401).send('Requested does not match with logged in user');
        return;
    }

    let con = mysql.createConnection(database.getDatabaseCredentials());

    con.connect();

    con.query('SELECT * FROM streamer JOIN users ON streamerUserId = userId JOIN eventTokens ON tokenUserId = streamerUserId WHERE userUsername = ?', [streamerNameID, streamerNameID], async (error, results, fields) => {
        con.end();
        if (error) {
            console.error(error); 
            res.status(500).send();
        }

        if (results[0] !== undefined && results[0].userId !== undefined && results[0].token !== undefined) {

            const token = results[0].token;
            /* Custom minecraft commands events */

            if ([1, 2, 3, 4, 5].includes(parseInt(req.body.event_type)) && req.body.type == 'minecraft') {

                const { type, redeemed_by, event_type, minecraft_username } = req.body;
                let input = true;
                if(minecraft_username === undefined || minecraft_username === null) input = false;
                if(input && minecraft_username === '') {
                    res.redirect("./" + streamerNameID);
                    return;
                }

                con = mysql.createConnection(database.getDatabaseCredentials());
                con.connect();
                con.query('select * from customMinecraftEvents WHERE streamerId = ? AND isEnabled = 1 AND streamerEventId = ?', [results[0].userId, event_type], (error, results, fields) => {
                    con.end();
                    if (error) {
                        console.error(error);
                        res.status(500).send();
                    }
                    if (results[0] !== undefined && results[0].streamerId !== undefined) {
                        let commandString = results[0].eventCommandString;
                        if(input) commandString = commandString.replace('%arg%', minecraft_username);
                        const event_cost = results[0].eventCost;
                        let viewerId;

                        if(req.user === undefined || req.user.id === undefined) {
                            res.redirect("./" + streamerNameID);
                        } else {
                            viewerId = req.user.id;
                        }
                        con = mysql.createConnection(database.getDatabaseCredentials());
                        con.connect();

                        con.query('select points from points where streamerId = ? and viewerId = ?', [results[0].streamerId, viewerId], (error, results69, fields) => {
                            con.end();
                            let points = 0;
                            if(error) {
                                console.error(error);
                                return res.status(500).send();
                            }
                            if(results69[0] !== undefined && results69[0].points !== undefined) {
                                points = results69[0].points;
                            }
                            if(points >= event_cost) {
                                con = mysql.createConnection(database.getDatabaseCredentials());
                                con.connect();
                                const SID = results[0].streamerId;
                                con.query('update points set points = points - ? where streamerId = ? and viewerId = ?', [event_cost, results[0].streamerId, viewerId], (error, results69, fields) => {
                                    con.end();
                                    if (error) {
                                        console.error(error);
                                        return res.status(500).send();
                                    }
                                    if(input) {
                                        eventFunctions.addCustomMinecraftEvent(token, {redeemed_by: redeemed_by, type: 'custom_command', minecraft_username: minecraft_username, command: commandString}, SID);
                                    } else {
                                        eventFunctions.addCustomMinecraftEvent(token, {redeemed_by: redeemed_by, type: 'custom_command', command: commandString}, SID);
                                    }
                                    res.redirect("./" + streamerNameID);
                                    return;
                                });
                            }

                        });
                    } else {
                        res.redirect("./" + streamerNameID);
                    }

                });

            } else {

                const { type, redeemed_by, event_type } = req.body;
                if (type === undefined || redeemed_by === undefined || event_type === undefined) {
                    res.redirect("./" + streamerNameID);
                    return;
                }

                if(event_type === "whitelist_add") {
                    if(req.body.minecraft_username === undefined || req.body.minecraft_username === null || req.body.minecraft_username === '') {
                        res.redirect("./" + streamerNameID);
                        return;
                    }
                }

                const token = results[0].token;

                if (redeemed_by === undefined || redeemed_by === null || redeemed_by === '') return res.redirect("./" + streamerNameID);
                con = mysql.createConnection(database.getDatabaseCredentials());
                con.connect();
                con.query('SELECT * FROM StreamerEvents WHERE EventStreamerUserId = ? AND is_enabled = 1 AND StreamerEventId IN ( SELECT event_id FROM events WHERE event_data_name = ?)', [results[0].userId, event_type], (error, results, fields) => {
                    con.end();
                    if (error) {
                        console.error(error);
                        res.status(500).send();
                    }
                    if (results[0] !== undefined && results[0].EventStreamerUserId !== undefined) {
                        
                        const event_cost = results[0].event_cost;
                        let viewerId;

                        if(req.user === undefined || req.user.id === undefined) {
                            return res.redirect("./" + streamerNameID);
                        } else {
                            viewerId = req.user.id;
                        }
                        con = mysql.createConnection(database.getDatabaseCredentials());
                        con.connect();

                        con.query('select points from points where streamerId = ? and viewerId = ?', [results[0].EventStreamerUserId, viewerId], (error, results69, fields) => {
                            con.end();
                            let points = 0;
                            const SID = results[0].EventStreamerUserId

                            if(error) {
                                console.error(error);
                                return res.status(500).send();
                            }
                            if(results69[0] !== undefined && results69[0].points !== undefined) {
                                points = results69[0].points;
                            }
                            if(points >= event_cost) {
                                con = mysql.createConnection(database.getDatabaseCredentials());
                                con.connect();
                                con.query('update points set points = points - ? where streamerId = ? and viewerId = ?', [event_cost, results[0].EventStreamerUserId, viewerId], (error, results69, fields) => {
                                    con.end();
                                    if (error) {
                                        console.error(error);
                                        res.status(500).send();
                                        return;
                                    }
                                    if(event_type === "whitelist_add") {
                                        eventFunctions.addEvent(token, type, {redeemed_by: redeemed_by, type: event_type, minecraft_username: req.body.minecraft_username}, SID);
                                    } else if (event_type === "change_weather") {
                                        eventFunctions.addEvent(token, type, {redeemed_by: redeemed_by, type: event_type, weather_type: req.body.weather_type}, SID);
                                    } else {
                                        eventFunctions.addEvent(token, type, {redeemed_by: redeemed_by, type: event_type}, SID);
                                    }

                                    return res.redirect("./" + streamerNameID);
                                });
                            } else {
                                if(isDevMode) console.log(`User tried to activate ${type} ${JSON.stringify({redeemed_by: redeemed_by, type: event_type})} but did not have enough points`);
                            }

                        });
                    } else {
                        return res.redirect("./" + streamerNameID);
                    }
                });
            }
        } else {
            return res.redirect("./" + streamerNameID);
        }
    });
});

router.get('/:id', auth.authViewer, (req, res) => {

    const streamerNameID = req.params.id;

    let con = mysql.createConnection(database.getDatabaseCredentials());

    con.connect();

    con.query('SELECT * FROM streamer JOIN users ON streamerUserId = userId WHERE userUsername = ?', [streamerNameID, streamerNameID], (error, results, fields) => {
        con.end();
        if (error) {
            console.error(error);
            return res.status(500).send();
        }

        if (results[0] !== undefined && results[0].userId !== undefined) {
            con = mysql.createConnection(database.getDatabaseCredentials());
            con.connect();
            con.query('SELECT * FROM events LEFT JOIN StreamerEvents ON event_id = StreamerEventId WHERE StreamerEvents.EventStreamerUserId = ? AND is_enabled = 1', [results[0].userId], (error, results2, fields) => {
                con.end();
                if(error) {
                    console.error(error);
                    return res.status(500).send();
                }


                let events = {
                };

                for(i = 0; i < results2.length; i++) {
                    const jsonObject = JSON.parse(results2[i].event_data);
                    if (events[results2[i].event_type] === undefined) {
                        events[results2[i].event_type] = [];
                    }

                    if (results2[i].event_cost === null)  results2[i].event_cost = 0;

                    events[results2[i].event_type].push(
                        {
                            title: jsonObject.title,
                            description: jsonObject.description,
                            price: results2[i].event_cost,
                            image_url: jsonObject.image_url,
                            m_id: results2[i].event_id,
                            enabled: results2[i].is_enabled,
                            data_name: results2[i].event_data_name,
                        }
                    )    
                
                }

                const streamerId = results[0].userId;
                let viewerId;

                if(req.user === undefined || req.user.id === undefined) {
                    viewerId = 0;
                } else {
                    viewerId = req.user.id;
                }

                con = mysql.createConnection(database.getDatabaseCredentials());
                con.connect();
                con.query('select points from points where streamerId = ? and viewerId = ?', [results[0].userId, viewerId], (error, results69, fields) => {
                    con.end();

                    let viewer_name = "";

                    if(req.user !== undefined && req.user.display_name !== undefined) {
                        viewer_name = req.user.display_name;
                    }

                    let points = 0;

                    if(error) {
                        console.error(error);
                        return res.status(500).send();
                    }
                    if(results69[0] !== undefined && results69[0].points !== undefined) {
                        points = results69[0].points;
                    }  

                    con = mysql.createConnection(database.getDatabaseCredentials());
                    con.connect();
                    con.query('select * from customMinecraftEvents WHERE streamerId = ? AND isEnabled = 1', [streamerId], (error, resultscringe, fields) => {
                        con.end();
                        res.render('viewer_streamerpage',
                        {
                            WebsiteTitleElementText: `${webTitle} - ${results[0].userDisplayname}`,
                            hostname: hostname,
                            CssUrl: 'stylesheet3.css',
                            streamername: results[0].userDisplayname,
                            streamerslogan: results[0].streamerSlogan,
                            streamerdescription: results[0].streamerDescription,
                            streamerProfileImageUrl: results[0].userProfileImageUrl,
                            activesince: results[0].streamerActiveSince,
                            modules: events,
                            customMCModules: resultscringe,
                            points: points,
                            viewername: viewer_name
                        });
                    });
                });

            });

            
        } else {
            return res.redirect("/");
        }
    });
});

module.exports = router;