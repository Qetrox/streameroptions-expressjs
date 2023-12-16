const express= require('express');
const router = express.Router()
const auth = require('../middleware/auth');
const streamer = require('../middleware/streamer');
const mysql = require('mysql');
const database = require('../functions/sql');
const eventFunctions = require('../functions/eventFunctions');
const { admin } = require('../data/roles.json');



router.get('/devMonitor', auth.authCookie, (req, res) => {
    if(admin.includes(req.user.id)) {
        res.render(
            'dev/monitor',
            { 
                WebsiteTitleElementText: webTitle + ' - Dev Monitor',
                hostname: hostname,
                CssUrl: 'devStyle1.css'
            }
            );
    }
});

module.exports = router;
