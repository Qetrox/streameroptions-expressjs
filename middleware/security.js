const ipRangeCheck = require('ip-range-check');
const fs = require('fs');

const cloudflareIPs = fs.readFileSync('./middleware/ipv4.txt', 'utf-8').replace(/\r/g, '',).split('\n');

function onlyAllowCloudflare(req, res, next) {
    let ip = req.ip.split(':')[3];

    /* If the IP is undefined, it means that the user is accessing the website from localhost. */
    /* Only use in development. */
    if(ip == undefined) {
        ip = req.ip;
        if(ip == '::1') {
            next();
            return;
        }
    }

    if (ipRangeCheck(ip, cloudflareIPs)) {
        // IP is within the Cloudflare range
        next();
    } else {
        console.warn('Unauthorized IP: ' + ip + '\n tried to access: ' + req.originalUrl);
    }
}


module.exports = {
    onlyAllowCloudflare: onlyAllowCloudflare
}