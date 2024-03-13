const mysql = require('mysql');
const database = require('./sql');
const websocket = require('./websocket');


// Variables for server information
let start_time;
let connected_tokens = 0;
let users = 0;
let streamers = 0;
let total_events = 0;
let now_live = [];

/**
 * Sets the streamer to live or not live
 * @param {Number} streamerId 
 * @param {Boolean} isLive 
 * @returns {VoidFunction}
 */
async function updateNowLive(streamerId, isLive, data, sendNotification) {
    if (isLive) {
        //make sure there are no duplicates
        if (now_live.includes(streamerId)) return;
        now_live.push(streamerId);

        if (sendNotification) {
            websocket.sendGlobal(JSON.stringify({
                type: "liveNotification",
                data: {
                    streamerid: data.id,
                    displayname: data.user_name,
                    username: data.user_login,
                    title: data.title,
                    game: data.game_name,
                }
            }));
        }

    } else {
        now_live = now_live.filter((id) => id !== streamerId);
    }
}

/**
 * 
 * @param {Number} streamerId 
 * @returns {Boolean} Returns true if the streamer is live, false if not.
 */
async function isLive(streamerId) {
    return now_live.includes(streamerId);
}

/**
 * Gets the list of streamers that are live.
 * @returns {Array} Returns an array of streamerIds that are live.
 */
function getNowLive() {
    return now_live;
}

/**
 * Saves an event to the database.
 * @param {Object} data The data to save to the database.
 * @param {String} type The type of event.
 * @param {Number} streamerId The Id of the streamer for who the event was.
 * @returns {VoidFunction}
 */
async function saveEventToDatabase(data, type, streamerId, event_id) {

    const con = mysql.createConnection(database.getDatabaseCredentials());
    con.connect();

    con.query('INSERT INTO eventLog (streamerId, type, data, event_id) VALUES (?, ?, ?, ?)', [streamerId, type, JSON.stringify(data), event_id], (error, results, fields) => {
        con.end();
        if (error) {
            console.error(error);
            return false;
        }
    });

}

/**
 * Updates the user and streamer counts.
 * @returns {VoidFunction}
 */
async function updateUsersAndStreamers() {
    let con = mysql.createConnection(database.getDatabaseCredentials());
    con.connect();
    con.query('select count(userId) from users', (error, results, fields) => {
        con.end();
        if (error) {
            console.error(error);
            return;
        }
        users = results[0]['count(userId)'];
        con = mysql.createConnection(database.getDatabaseCredentials());
        con.connect();
        con.query('select count(streamerUserId) from streamer', (error, results, fields) => {
            con.end();
            if (error) {
                console.error(error);
                return;
            }
            streamers = results[0]['count(streamerUserId)'];
        });
    });
}

/**
 * Starts the server statistics functions.
 */
async function start() {
    start_time = Date.now();
    updateUsersAndStreamers();

    setInterval(() => {
        updateUsersAndStreamers();
    }, 1000 * 60 * 5 /* 5 minutes */);

}

/**
 * Changes the connected tokens count.
 * @param {Number} change 
 */
async function updateConnectedTokens(change) {
    connected_tokens += change;
}

/**
 * Changes the total events count.
 * @param {Number} change 
 */
async function updateTotalEvents(change) {
    total_events += change;
}

/**
 * Gets the statistics counts.
 * @returns {Object} Returns an object with the statistics counts.
 */
function getStatisticsCounts() {
    return {
        connected_tokens,
        users,
        streamers,
    }
}

/**
 * 
 * @returns {Number} Returns the time the server started.
 */
function getStartTime() {
    return start_time;
}

module.exports = {
    start,
    updateConnectedTokens,
    getStatisticsCounts,
    getStartTime,
    updateTotalEvents,
    saveEventToDatabase,
    updateNowLive,
    isLive,
    getNowLive,
}