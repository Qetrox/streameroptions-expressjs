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

    database.getPool().query('SELECT * FROM users WHERE userId = ?', [userId], function (error, results, fields) {
        if (results[0].userEmail == null || results[0].userEmail == "" || results[0].userEmail == undefined) return;
        if (error) throw error;
        const mailOptions = {
            from: '"Streamer Options" <noreply@streameroptions.com>',
            to: results[0].userEmail,
            subject: "Welcome to Streamer Options!",
            text: "",
            html: `
        <html>
        <head><meta name="color-scheme" content="only"></head>
        <body style='background-color: #fff; color-scheme: light only;'>
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

        try {
            transporter.sendMail(mailOptions);
        } catch (error) { }

    });


}

async function sendMonthyStatisticsMail(userId, monthNumber, yearNumber) {

    const transporter = nodemailer.createTransport({
        host: "mail.zxcs.nl",
        port: 465,
        secure: true,
        auth: {
            user: "noreply@streameroptions.com",
            pass: process.env.NOREPLY_PWD,
        },
    });

    switch (monthNumber) {
        case 1:
            month = "January"
            break;
        case 2:
            month = "February"
            break;
        case 3:
            month = "March"
            break;
        case 4:
            month = "April"
            break;
        case 5:
            month = "May"
            break;
        case 6:
            month = "June"
            break;
        case 7:
            month = "July"
            break;
        case 8:
            month = "August"
            break;
        case 9:
            month = "September"
            break;
        case 10:
            month = "October"
            break;
        case 11:
            month = "November"
            break;
        case 12:
            month = "December"
            break;
    }

    const firstDay = new Date(yearNumber, monthNumber - 1, 1);
    const lastDay = new Date(yearNumber, monthNumber, 0);

    const firstTimestamp = Math.floor(firstDay.getTime() / 1000);
    const lastTimestamp = Math.floor(lastDay.getTime() / 1000);

    database.getPool().query('SELECT * FROM users WHERE userId = ?', [userId], function (error, results, fields) {
        if (results[0].userEmail == null || results[0].userEmail == "" || results[0].userEmail == undefined) return;
        if (error) throw error;

        const Email = results[0].userEmail;
        const userUsername = results[0].userUsername
        const userDisplayname = results[0].userDisplayname

        database.getPool().query('SELECT COUNT(*) as eventCount, SUM(event_cost) as totalCost FROM eventLog JOIN StreamerEvents ON StreamerEventId = event_id WHERE UNIX_TIMESTAMP(timestamp) BETWEEN ? AND ? AND EventStreamerUserId = ? AND streamerId = ?', [firstTimestamp, lastTimestamp, userId, userId], function (error, results, fields) {
            if (error) throw error;

            const hoursWatched = Math.round(results[0].totalCost / 600);

            const mailOptions = {
                from: '"Streamer Options" <noreply@streameroptions.com>',
                to: Email,
                subject: `Your ${month} ${yearNumber} Statistics on Streamer Options`,
                text: "",
                html: `
    <html>
    
    <head>
        <meta name="color-scheme" content="only">
    </head>
    
    <body style='background-color: #eee; color-scheme: light only; display: flex; align-items: center;'>
        <div style="width: 600px; background-color: #fff; margin: 20px auto;">
            <div
                style='color-scheme: light only; display: flex; justify-content: center; align-items: center; flex-wrap: wrap; height: 200px; padding: 10px; background-image: url("https://streameroptions.com/i/banner0_mobile.png"); background-repeat: no-repeat; background-size: cover; background-position: center;'>
                <div style='color-scheme: light only; width: 100%;'>
                    <h1 style='color-scheme: light only; text-align: center; color: #eee;'>Your Statistics on
                        Streamer Options</h1>
                    <h3 style='color-scheme: light only; text-align: center; color: #eee;'>${month} ${yearNumber} -
                        ${userDisplayname}</h3>
                </div>
            </div>
            <div style='color-scheme: light only; text-align: center; margin: 0; padding: 20px;'>
                <h2 style="margin: 0; text-align: left">How many many times did your <strong>viewers</strong> bully you?
                    What insane amount of <strong>points</strong> did they spent? We are here to tell you!
                </h2>
                <h1 style="margin: 0; margin-top: 30px; text-align: left">Your viewers activated ${results[0].eventCount} events</h1>
                <h4 style="margin: 0; text-align: left">Maybe you should change the prices...</h4>
                <h1 style="margin: 0; margin-top: 30px; text-align: left">And spent a total of ${results[0].totalCost} points</h1>
                <h4 style="margin: 0; text-align: left">They had to watch ${hoursWatched} hours for that...</h4>
                <h4 style="margin: 0; text-align: left"></h4>
                <br><br>
                <h2>That was it for this month. Until next time!</h2>
                <a style='color-scheme: light only;' href='https://streameroptions.com/'>Click here to go to Streamer
                    Options</a>
                <h6 style='color-scheme: light only;'>You received this because this email is linked to the Twitch
                    account
                    ${userUsername}.</h6>
            </div>
        </div>
    
    </body>
    
    </html>
        `,
            }

            try {
                transporter.sendMail(mailOptions);
            } catch (error) { }

        });
    });
}

async function sendMonthlyStatisticsMailToAll(sure) {
    if (sure != "yes") return;
    console.warn("Sending monthly statistics to all users. This will take a while.");
    database.getPool().query('SELECT streamerUserId FROM streamer', function (error, results, fields) {
        if (error) throw error;
        results.forEach(user => {
            sendMonthyStatisticsMail(user.streamerUserId, 2, 2024);
        });
    });
}

module.exports = {
    sendSignupMail,
    sendMonthyStatisticsMail,
    sendMonthlyStatisticsMailToAll
}