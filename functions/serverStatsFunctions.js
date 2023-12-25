const mysql = require('mysql');
const database = require('./sql');


// Variables for server information
let start_time;
let connected_tokens = 0;
let users = 0;
let streamers = 0;
let total_events = 0;

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

async function start() {
    start_time = Date.now();
    updateUsersAndStreamers();

    setInterval(() => {
        updateUsersAndStreamers();
    }, 1000 * 60 * 5 /* 5 minutes */);

}

async function updateConnectedTokens(change) {
    connected_tokens += change;
}

async function updateTotalEvents(change) {
    total_events += change;
}

function getStatisticsCounts() {
    return {
        connected_tokens,
        users,
        streamers,
    }
}

function getStartTime() {
    return start_time;
}

module.exports = {
    start,
    updateConnectedTokens,
    getStatisticsCounts,
    getStartTime,
    updateTotalEvents,
}