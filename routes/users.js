require('dotenv').config({ path: '../.env' });


const mysql = require('mysql');
const express = require('express');
const router = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authFunctions = require('../functions/authFunctions');
const database = require('../functions/sql');
const axios = require('axios');
const mailFunctions = require('../functions/mailFunctions');

/**
 * Performs bitwise operations and returns a string representation of the result.
 * @param {Array} d - An array of numbers to perform bitwise operations on.
 * @param {Number} _ - A number used in the bitwise operations.
 * @returns {String} - A string representation of the result of the bitwise operations.
 */
var MD5 = function (d) { var r = M(V(Y(X(d), 8 * d.length))); return r.toLowerCase() }; function M(d) { for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++)_ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _); return f } function X(d) { for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++)_[m] = 0; for (m = 0; m < 8 * d.length; m += 8)_[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32; return _ } function V(d) { for (var _ = "", m = 0; m < 32 * d.length; m += 8)_ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255); return _ } function Y(d, _) { d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _; for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) { var h = m, t = f, g = r, e = i; f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e) } return Array(m, f, r, i) } function md5_cmn(d, _, m, f, r, i) { return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m) } function md5_ff(d, _, m, f, r, i, n) { return md5_cmn(_ & m | ~_ & f, d, _, r, i, n) } function md5_gg(d, _, m, f, r, i, n) { return md5_cmn(_ & f | m & ~f, d, _, r, i, n) } function md5_hh(d, _, m, f, r, i, n) { return md5_cmn(_ ^ m ^ f, d, _, r, i, n) } function md5_ii(d, _, m, f, r, i, n) { return md5_cmn(m ^ (_ | ~f), d, _, r, i, n) } function safe_add(d, _) { var m = (65535 & d) + (65535 & _); return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m } function bit_rol(d, _) { return d << _ | d >>> 32 - _ }

router.get('/login/twitch', express.urlencoded({ extended: true }), (req, res) => {
    const TWITCH_ID_DOMAIN = 'https://id.twitch.tv/';

    const noCRRF = MD5(`${Date.now()}${Math.random() * 1000}`)

    const TWITCH_LOGIN_URI = TWITCH_ID_DOMAIN + 'oauth2/authorize?' + 'client_id=' + process.env.TWITCH_CLIENT_ID + '&redirect_uri=' + encodeURIComponent('https://streameroptions.com/users/login/twitch-auth') + '&response_type=code&scope=' + encodeURIComponent('user:read:email') + "+" + encodeURIComponent('moderator:read:chatters') + '&state=' + encodeURIComponent(noCRRF);

    res.cookie('csrf_token', noCRRF, { httpOnly: true });
    return res.redirect(TWITCH_LOGIN_URI);

});

router.get('/login/twitch-auth', express.urlencoded({ extended: true }), async (req, res) => {
    const TWITCH_ID_DOMAIN = 'https://id.twitch.tv/';

    if (req.query.code == undefined) {
        return res.redirect('./twitch');
    }

    const csrfToken = req.cookies.csrf_token;
    if (!csrfToken || csrfToken !== req.query.state) {
        return res.redirect('./twitch');
    }

    const noCRRF = MD5(`${Date.now()}${Math.random() * 1000}`)
    const TWITCH_LOGIN_URI = TWITCH_ID_DOMAIN + 'oauth2/authorize?' + 'client_id=' + process.env.TWITCH_CLIENT_ID + '&redirect_uri=' + encodeURIComponent('https://streameroptions.com/users/login/twitch-auth') + '&response_type=code&scope=' + encodeURIComponent('user:read:email') + "+" + encodeURIComponent('moderator:read:chatters') + '&state=' + encodeURIComponent(noCRRF);

    try {
        const response = await axios.post('https://id.twitch.tv/oauth2/token',
            {
                client_id: process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_SECRET,
                code: req.query.code,
                grant_type: 'authorization_code',
                redirect_uri: 'https://streameroptions.com/users/login/twitch-auth'
            }
        )

        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        const userInfoResponse = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID
            }
        });

        const twitchUser = userInfoResponse.data.data[0];

        database.getPool().query('INSERT INTO accessTokens VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, refreshToken = ?', [accessToken, refreshToken, twitchUser.id, accessToken, refreshToken], (error, results, fields) => {
            if (error) {
                console.error(error);
                return res.status(500).send();
            }

            database.getPool().query('SELECT * FROM users WHERE userId = ?', [twitchUser.id], async (error, results, fields) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send();
                }

                if (results[0] !== undefined && results[0].userId !== undefined) {

                    //update users credentials
                    database.getPool().query('UPDATE users SET userEmail = ?, userUsername = ?, userDisplayname = ?, userProfileImageUrl = ? WHERE userId = ?', [twitchUser.email, twitchUser.login, twitchUser.display_name, twitchUser.profile_image_url, twitchUser.id], (error, results, fields) => {
                        if (error) {
                            console.error(error);
                            return res.status(500).send();
                        }

                        const jwt_user = { name: twitchUser.login, id: twitchUser.id, display_name: twitchUser.display_name };
                        const accessToken = authFunctions.genToken(jwt_user);
                        const refreshToken = authFunctions.genRefreshToken(jwt_user, jwt_user.id);
                        res.cookie('token', accessToken, { expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000) })
                        res.cookie('refreshtoken', refreshToken, { expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000) })

                        return res.redirect("../");

                    });
                } else {
                    // Add the user to the database
                    const insertQuery = 'INSERT INTO users (userId, userEmail, userUsername, userDisplayname, userProfileImageUrl) VALUES (?, ?, ?, ?, ?)';
                    const insertValues = [twitchUser.id, twitchUser.email, twitchUser.login, twitchUser.display_name, twitchUser.profile_image_url];
                    database.getPool().query(insertQuery, insertValues, (error, results, fields) => {
                        if (error) {
                            console.error(error);
                            return res.status(500).send();
                        }

                        const jwt_user = { name: twitchUser.login, id: twitchUser.id, display_name: twitchUser.display_name };
                        const accessToken = authFunctions.genToken(jwt_user);
                        const refreshToken = authFunctions.genRefreshToken(jwt_user, twitchUser.id);
                        res.cookie('token', accessToken, { expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000) })
                        res.cookie('refreshtoken', refreshToken, { expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000) })

                        res.redirect("../");
                        setTimeout(() => {
                            mailFunctions.sendSignupMail(twitchUser.id);
                        }, 500);
                    });
                }
            });
        });
    } catch (e) {
        return res.redirect(TWITCH_LOGIN_URI);
    }
});

module.exports = router;