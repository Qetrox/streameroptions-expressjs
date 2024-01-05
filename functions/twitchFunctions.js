require('dotenv').config({ path: '../.env' });
const axios = require('axios')
const database = require('./sql')
const mysql = require('mysql')

/**
 * Refreshes a twitch token and returns the new token and refresh token
 * @param {string} refreshToken - The refresh token
 * @param {string} twitch_id - The twitch id of the user
 * @returns {object} - The new token and refresh token as an object
 */
async function refreshTwitchToken(refreshToken, twitch_id) {
    const url = 'https://id.twitch.tv/oauth2/token';

    axios.post(url, {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_SECRET,
        grant_type: 'refresh_token',
        refresh_token: encodeURIComponent(refreshToken)
    }).then((response) => {

        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        let con = mysql.createConnection(database.getDatabaseCredentials());
        con.connect();
        con.query('INSERT INTO accessTokens VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, refreshToken = ?', [accessToken, refreshToken, twitch_id, accessToken, refreshToken], (error, results, fields) => {
            con.end();
            if(error) {
                console.error(error);
                return;
            }
        });
    }).catch((error) => {
        console.error(error);
        return;
    });
}

module.exports = {
    refreshTwitchToken,
}