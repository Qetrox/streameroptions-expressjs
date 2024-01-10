const express= require('express');
const router = express.Router()
const auth = require('../middleware/auth');
const streamer = require('../middleware/streamer');
const mysql = require('mysql');
const database = require('../functions/sql');
const crypto = require('crypto');
const e = require('express');

var MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}


router.get('/dashboard', auth.authCookie, streamer.isStreamerSetup, async (req, res) => {

    CSRFToken = MD5(crypto.randomBytes(64).toString('hex'));
    res.cookie('CSRFToken', CSRFToken, { maxAge: 900000, httpOnly: true });

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
                CSRFToken: CSRFToken,
            }
            );
        });
    });
});

router.get('/save-modules', auth.authCookie, streamer.isStreamerSetup, async (req, res) => {
    let enabled = 0;
    if(req.query === undefined || req.query === null) return res.json({success: false, error: 'Missing query parameters'});

    if(req.cookies.CSRFToken == undefined || req.cookies.CSRFToken == null) return res.json({success: false, error: 'CSRFToken not valid'});
    if(req.query.CSRFToken == undefined || req.query.CSRFToken == null) return res.json({success: false, error: 'CSRFToken not specified'});
    if(req.streamer.streamerUserId == undefined || req.streamer.streamerUserId == null) return res.json({success: false, error: 'Not logged in'})
    if(req.query.module_id == undefined || req.query.module_id == null) return res.json({success: false, error: 'No module id specified'});
    if(req.query.price == undefined || req.query.price == null) return res.json({success: false, error: 'No price specified'});
    if(req.query.toggled == undefined || req.query.toggled == null) return res.json({success: false, error: 'No enabled specified'});
    if(req.query.CSRFToken != req.cookies.CSRFToken) return res.json({success: false, error: 'CSRFToken not valid'});

    try {
        const con = mysql.createConnection(database.getDatabaseCredentials());
        con.connect();
        if(req.query.toggled == 'true') enabled = 1;
        con.query('insert into StreamerEvents (EventStreamerUserId, StreamerEventId, is_enabled, event_cost) values (?, ?, ?, ?) ON DUPLICATE KEY UPDATE is_enabled = ?, event_cost = ?', [req.streamer.streamerUserId, req.query.module_id, enabled, req.query.price, enabled, req.query.price], (error, results, fields) => {

            con.end();
            if(error) {
                console.error(error);
                return res.json({success: false, error: 'Try again later'});
            } else {
                return res.json({success: true});
            }
        });
    } catch (err) {
        console.error(error);
        return res.json({success: false, error: 'Try again later'});
    }
});
router.get('/save-custom-minecraft-modules', auth.authCookie, streamer.isStreamerSetup, async (req, res) => {
    if(req.query === undefined || req.query === null) return res.json({success: false, error: 'Missing query parameters'});
    if(req.query.CSRFToken != req.cookies.CSRFToken) return res.json({success: false, error: 'CSRFToken not valid'});
    if(req.cookies.CSRFToken == undefined || req.cookies.CSRFToken == null) return res.json({success: false, error: 'CSRFToken not valid'});
    if(req.query.CSRFToken == undefined || req.query.CSRFToken == null) return res.json({success: false, error: 'CSRFToken not valid'});

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
                    return res.json({success: false, error: 'Try again later'});
                } else {
                    return res.json({success: true});
                }
            }
        );
    } catch (err) {
        console.error(error);
        return res.json({success: false, error: 'Try again later'});
    }
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