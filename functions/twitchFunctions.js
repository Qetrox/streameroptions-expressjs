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

        database.getPool().query('INSERT INTO accessTokens VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, refreshToken = ?', [accessToken, refreshToken, twitch_id, accessToken, refreshToken], (error, results, fields) => {
            if (error) {
                console.error(error);
                return;
            }
        });
    }).catch((error) => {
        if (error.response.data.status === 400 && error.response.data.message == 'Invalid refresh token') {
            database.getPool().query('DELETE FROM accessTokens WHERE tokenUserId = ?', [twitch_id], (error, results, fields) => {
                if (error) {
                    console.error(error);
                    return;
                }
                logging.info('Removed invalid twitch access & refresh token for user: ' + twitch_id);
            });
            return;
        }
        console.error(error);
        return;
    });
}

module.exports = {
    refreshTwitchToken,
}