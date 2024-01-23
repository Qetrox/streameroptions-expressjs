const { WebSocketServer } = require("ws");
const WebSocket = require("ws");
const crypto = require('crypto');


const key = "verycoolkeythingiu234hv345vbhg345b2489agh89hjolij230gna0rgu23bhuj89usdbg9hbhg9whvba904gyaczv830289567nvanbzxmgnopwejiweolghertrthwevgasdiopdvbjgpoi";

let wss;

async function init() {
    wss = new WebSocketServer({ port: 8081 });

    wss.on("connection", function connection(ws) {

        ws.on("message", (data) => {
            handleIncoming(data.toString());
        });

    });

}

// iv cant be random
const iv = Buffer.alloc(16, 0)

function encrypt(message) {
    const cipher = crypto.createCipheriv('aes256', key, iv);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex')
    return encrypted
}

function decrypt(encryptedMessage) {
    try {
        const decipher = crypto.createDecipheriv('aes256', key, iv);
        let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted
    } catch (ex) {
        return null;
    }
}

async function sendGlobal(message) {
    const encryptedMessage = encrypt(message);
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(encryptedMessage);
        }
      });
}

async function send(ws, message) {
    const encryptedMessage = encrypt(message);
    ws.send(encryptedMessage);
}

async function handleIncoming(data) {
    const message = decrypt(data);
    if(message === null) return;
    console.log(message);
}

module.exports = {
    init,
    send,
    sendGlobal,
};