const database = require('../functions/sql');
const mysql = require('mysql');
const serverStatsFunctions = require('../functions/serverStatsFunctions');

let Events = {
};

/**
 * Sends events to the client with the specified token and type.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} token - The token associated with the events.
 * @param {string} type - The type of events to send.
 * @returns {void}
 */
function sendEvents(req, res, token, type) {

    if (!Events[type]) {
        Events[type] = {};
    }


    const EventsGroup = Events[type];

    if (EventsGroup[token] !== null && EventsGroup[token] !== undefined) {
        const tokenEvents = EventsGroup[token];

        for (let index = 0; index < tokenEvents.length; index++) {
            res.write(`data: ${JSON.stringify(tokenEvents[index])}\n\n`);
        }
        tokenEvents.splice(0, tokenEvents.length);
    }
}

/**
 * Checks if a event request is valid.
 * @param {Object} eventData - The event data object.
 * @param {Number} streamerId - The streamer ID.
 * @returns {Boolean} - Whether the event is valid or not.
 */
async function isValidEvent(eventData, streamerId) {
    const { type, data } = eventData;

    if (type === undefined || data === undefined) {
        return false;
    }
    if (data.redeemed_by === undefined || data.Redeemed_by === null || data.Redeemed_by === '') return false;

    const con = mysql.createConnection(database.getDatabaseCredentials());
    con.connect();

    con.query('SELECT * FROM StreamerEvents WHERE EventStreamerUserId = ? AND event_id IN ( SELECT event_id FROM events WHERE event_data_name = ?)', [streamerId, data.type], (error, results, fields) => {
        con.end();
        if (error) {
            console.error(error);
            return false;
        }
        if (results[0] !== undefined && results[0].EventStreamerUserId !== undefined) {
            return true;
        } else {
            return false;
        }
    });
}

/**
 * Adds an event to the Events list.
 * @param {string} token - The token associated with the event.
 * @param {string} type - The type of event.
 * @param {object} data - The data associated with the event.
 * @param {number} id - The ID of the streamer.
 * @returns {void}
 */
async function addEvents(token, type, data, id, event_id) {
    if (!Events[type]) {
        Events[type] = {};
    }
    if (!Events[type][token]) {
        Events[type][token] = [];
    }

    Events[type][token].push(data);
    serverStatsFunctions.updateTotalEvents(1);
    if (!(id == 0 && event_id == 0)) serverStatsFunctions.saveEventToDatabase(data, type, id, event_id);
}

async function addCustomMinecraftEvent(token, data, id) {
    if (!Events['minecraft']) {
        Events['minecraft'] = {};
    }
    if (!Events['minecraft'][token]) {
        Events['minecraft'][token] = [];
    }
    Events['minecraft'][token].push(data);
    serverStatsFunctions.saveEventToDatabase(data, 'minecraft', id, 'NULL');
}


module.exports = {
    sendEvents: sendEvents,
    addEvent: addEvents,
    isValidEvent: isValidEvent,
    addCustomMinecraftEvent: addCustomMinecraftEvent,
}