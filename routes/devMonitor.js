const express = require('express');
const router = express.Router()
const auth = require('../middleware/auth');
const serverStatsFunctions = require('../functions/serverStatsFunctions');
const { admin } = require('../data/roles.json');
const e = require('express');

router.get('/devMonitorStats/', auth.authCookie, (req, res) => {
    if (admin.includes(req.user.id)) {
        return res.json(
            serverStatsFunctions.getStatisticsCounts()
        );
    } else {
        return res.status(403).send('You do not have permission to view this page.');
    }
});

router.get('/devMonitor', auth.authCookie, (req, res) => {
    if (admin.includes(req.user.id)) {
        return res.render(
            'dev/monitor',
            {
                WebsiteTitleElementText: webTitle + ' - Dev Monitor',
                hostname: hostname,
                CssUrl: 'devStyle1.css',
                startTime: serverStatsFunctions.getStartTime(),
                statistics: serverStatsFunctions.getStatisticsCounts(),
            }
        );
    } else {
        return res.redirect('../../../');
    }
});

module.exports = router;
