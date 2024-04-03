require('dotenv').config({ path: '../.env' });
const axios = require('axios');
const mysql = require('mysql');
const database = require('./sql');
const twitchFunctions = require('./twitchFunctions');
const serverStatsFunctions = require('./serverStatsFunctions');
const server = require('../server');
const { dontCheckPoints, isDevMode } = require('../data/dev.json');
const logging = require('../logging');

const CLIENT_ID = process.env.TWITCH_CLIENT_ID;

let firstTime = true;

/**
 * When there are more than 1000 chatters, this function is called to get the next 1000 chatters.
 * @param {String} cursor - The cursor to get the next chatters, this is received in the initial check.
 * @param {String} access_token - The access token of the streamer.
 */
async function pagination(cursor, access_token) {
    axios.get(`https://api.twitch.tv/helix/chat/chatters?broadcaster_id=${Streamer_Id}&moderator_id=${Streamer_Id}&first=1000&after=${cursor}`, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Client-Id': CLIENT_ID
        }
    }).then(response => {
        const chatters = response.data.data
        if (response.data.pagination.cursor !== undefined) {
            pagination(response.data.pagination.cursor, access_token)
        }
        chatters.forEach(chatter => {
            database.getPool().query('INSERT INTO points VALUES (?, ?, 10, 10) ON DUPLICATE KEY UPDATE points = points + 10, totalPoints = totalPoints + 10', [Streamer_Id, chatter.user_id], (error, results, fields) => {
                if (error) {
                    console.error(error);
                    return;
                }
            });
        });
    }).catch(error => {
        if (isDevMode) console.error("(1)Error while getting chatters for: " + Streamer_Id);
        if (isDevMode) console.error("Refreshing Token...");
        twitchFunctions.refreshTwitchToken(refreshToken, Streamer_Id);
    });
}

/**
 * Checks who are viewing the streamer, and updates their points (+10).
 * @param {number} Streamer_Id - ID of the streamer to check the viewers of
 * @param {string} access_token - Access token of the streamer.
 * @returns {void}
 */
async function updateViewers(Streamer_Id, access_token) {
    axios.get(`https://api.twitch.tv/helix/chat/chatters?broadcaster_id=${Streamer_Id}&moderator_id=${Streamer_Id}&first=1000`, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Client-Id': CLIENT_ID
        }
    }).then(response => {
        const chatters = response.data.data
        if (response.data.pagination.cursor !== undefined) {
            pagination(response.data.pagination.cursor, access_token)
        }
        chatters.forEach(chatter => {
            database.getPool().query('INSERT INTO points VALUES (?, ?, 10, 10) ON DUPLICATE KEY UPDATE points = points + 10, totalPoints = totalPoints + 10', [Streamer_Id, chatter.user_id], (error, results, fields) => {
                if (error) {
                    console.error(error);
                    return;
                }
            });
        });
    }).catch(error => {
        if (isDevMode) console.error("(1)Error while getting chatters for: " + Streamer_Id);
        if (isDevMode) console.error("Refreshing Token...");
        twitchFunctions.refreshTwitchToken(refreshToken, Streamer_Id);
    });
}

/**
 * Loops over every streamer in the database, and updates points of their viewers.
 * @returns {void}
 */

async function updateViewersForAll() {
    database.getPool().query('SELECT * FROM accessTokens', async (error, results, fields) => {
        if (error) {
            console.error(error);
            return;
        }

        if (isDevMode) console.log('Checking viewers for all streamers...')

        let broadcastnotification = true;
        if (firstTime) {
            broadcastnotification = false;
            firstTime = false;
        }

        logging.info('Checking viewers for ' + results.length + ' streamers');

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            axios.get(`https://api.twitch.tv/helix/streams?user_id=${result.tokenUserId}`, {
                headers: {
                    'Authorization': `Bearer ${result.token}`,
                    'Client-Id': CLIENT_ID
                }
            }).then(response => {
                if (isDevMode) console.log('Checked viewers for: ' + result.tokenUserId);
                const streams = response.data.data;
                if (streams.length > 0) {
                    updateViewers(result.tokenUserId, result.token);
                    serverStatsFunctions.updateNowLive(result.tokenUserId, true, streams[0], broadcastnotification);
                    if (isDevMode && !broadcastnotification) console.log('No notification for: ' + result.tokenUserId);
                } else {
                    serverStatsFunctions.updateNowLive(result.tokenUserId, false);
                }
            }).catch(error => {
                if (isDevMode) console.error("(2)Error while getting chatters for: " + result.tokenUserId);
                if (isDevMode) console.error("Refreshing Token...");
                twitchFunctions.refreshTwitchToken(result.refreshToken, result.tokenUserId);
            });
        }
    });
}

/**
 * Starts the point update loop.
 */
function start() {
    if (dontCheckPoints) {
        console.warn("Point Checking is disabled in dev config!");
        return;
    }
    updateViewersForAll();
    setInterval(() => {
        updateViewersForAll();
    }, 1000 * 60);
}

module.exports = {
    start: start
}