var nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' });
const database = require('../functions/sql');
const mysql = require('mysql');

async function sendSignupMail(userId) {

    const transporter = nodemailer.createTransport({
        host: "mail.zxcs.nl",
        port: 465,
        secure: true,
        auth: {
            user: "noreply@streameroptions.com",
            pass: process.env.NOREPLY_PWD,
        },
    });

    let con = mysql.createConnection(database.getDatabaseCredentials());
    con.connect();

    con.query('SELECT * FROM users WHERE userId = ?', [userId], function (error, results, fields) {
        con.end();
        if (error) throw error;
        const mailOptions = {
            from: '"Streamer Options" <noreply@streameroptions.com>',
            to: results[0].userEmail,
            subject: "Welcome to Streamer Options!",
            text: "",
            html: `
        <html>
        <head><meta name="color-scheme" content="only"></head>
        <body style='background-color: #F6E1E1; color-scheme: light only;'>
            <div style='color-scheme: light only; display: flex; justify-content: center; align-items: center; flex-wrap: wrap; min-height: 400px; margin: 20px 0; padding: 10px; background-image: url("https://streameroptions.com/i/banner0_mobile.png"); background-repeat: no-repeat; background-size: cover; background-position: center;'>
            <div style='color-scheme: light only; width: 100%;'>
                <h1 style='color-scheme: light only; text-align: center; color: #eee;'>Welcome to Streamer Options, ${results[0].userDisplayname}!</h1>
                <h3 style='color-scheme: light only; text-align: center; color: #eee;'>Thank you for signing up!</h3>
            </div>
            </div>
            <br><br>
            <div style='color-scheme: light only; text-align: center;'>
                <p style='color-scheme: light only;'>Streamer options is a website that allows creators to create more interaction with their viewers during streams. Viewers receive points by watching streams and use these points to activate in-game effects.</p>
                <a style='color-scheme: light only;' href='https://streameroptions.com/'>Click here to go to Streamer Options</a>
                <br><br>
                <h6 style='color-scheme: light only;'>You received this because this email is linked to the Twitch account ${results[0].userUsername}.</h6>
            </div>

        </body>
    </html>
    `,
        }

    transporter.sendMail(mailOptions);

    });


}

module.exports = {
    sendSignupMail
}