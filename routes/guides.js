const express= require('express');
const router = express.Router()
const guideJson = require('../data/guides.json');


router.get('/guides', (req, res) => {
    res.render(
        'guide_home',
        {
            WebsiteTitleElementText: webTitle + ' - Guides',
            hostname: hostname,
            CssUrl: '../guideStyle.css',
            guides: guideJson
        }
    )
});

router.get('/guides/:guide', (req, res) => {

    const reqGuide = req.params.guide;
    const guide = guideJson[reqGuide];
    if(!guide) return res.status(404).redirect('./');

    res.render(
        'guide_wrapper',
        {
            WebsiteTitleElementText: webTitle + ' - ' + guide.urlTitle,
            hostname: hostname,
            CssUrl: '../../guideStyle.css',
            guide: guide,
            reqlink: reqGuide
        }
    )
});

module.exports = router;
