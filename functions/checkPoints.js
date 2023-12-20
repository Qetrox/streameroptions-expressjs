require('dotenv').config({ path: '../.env' });
const axios = require('axios');
const mysql = require('mysql');
const database = require('./sql');
const twitchFunctions = require('./twitchFunctions');

const CLIENT_ID = process.env.TWITCH_CLIENT_ID;

/**
 * Checks who are viewing the streamer, and updates their points (+10).
 * @param {number} Streamer_Id - ID of the streamer to check the viewers of
 * @param {string} access_token - Access token of the streamer.
 * @returns {void}
 */
async function updateViewers(Streamer_Id, access_token) {
    axios.get(`https://api.twitch.tv/helix/chat/chatters?broadcaster_id=${Streamer_Id}&moderator_id=${Streamer_Id}`, {
    headers: {
        'Authorization': `Bearer ${access_token}`,
        'Client-Id': CLIENT_ID
    } 
    }).then(response => {
        console.log('Checked viewers for: ' + Streamer_Id);
        const chatters = response.data.data
        chatters.forEach(chatter => {
            const con = mysql.createConnection(database.getDatabaseCredentials());
            con.connect();
            con.query('INSERT INTO points VALUES (?, ?, 10) ON DUPLICATE KEY UPDATE points = points + 10', [Streamer_Id, chatter.user_id], (error, results, fields) => {
                con.end();
                if (error) {
                    console.error(error);
                    return;
                }
            });
        });
    }).catch(error => {
        console.error("Error while getting chatters for: " + Streamer_Id);
        console.error("Refreshing Token...");
        twitchFunctions.refreshTwitchToken(refreshToken, Streamer_Id);
    });
}

/**
 * Loops over every streamer in the database, and updates points of their viewers.
 * @returns {void}
 */

async function updateViewersForAll() {
    const con = mysql.createConnection(database.getDatabaseCredentials());
    con.connect();
    con.query('SELECT * FROM accessTokens', async (error, results, fields) => {
        con.end();
        if (error) {
            console.error(error);
            return;
        }

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            axios.get(`https://api.twitch.tv/helix/streams?user_id=${result.tokenUserId}`, {
                headers: {
                    'Authorization': `Bearer ${result.token}`,
                    'Client-Id': CLIENT_ID
                }
            }).then(response => {
                console.log('Checked viewers for: ' + result.tokenUserId);
                const streams = response.data.data;
                if (streams.length > 0) {
                    updateViewers(result.tokenUserId, result.token);
                }
            }).catch(error => {
                console.error("Error while getting chatters for: " + result.tokenUserId);
                console.error("Refreshing Token...");
                twitchFunctions.refreshTwitchToken(result.refreshToken, result.tokenUserId);
            });
        }
    });
}

/**
 * Starts the point update loop.
 */
function start() {
    updateViewersForAll();
    setInterval(() => {
        updateViewersForAll();
    }, 1000 * 60);
}

module.exports = {
    start: start
}