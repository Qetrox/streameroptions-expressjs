require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const userRouter = require('./routes/users');
const streamerRouter = require('./routes/streamer');
const eventRouter = require('./routes/events');
const mainRouter = require('./routes/main');
const checkPoints = require('./functions/checkPoints');
const security = require('./middleware/security');

webTitle = 'Streamer Options'
hostname = 'https://streameroptions.com'

app.set('x-powered-by', false)
app.use(security.onlyAllowCloudflare);
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use('/users', userRouter);
app.use('/streamer', streamerRouter);
app.use('/events', eventRouter);
app.use('/', mainRouter);

app.use(express.urlencoded({
    extended: true
  }))

app.set('view engine', 'ejs');

checkPoints.start();

const fs = require('fs'),
    http = require('http'),
    https = require('https');

const options = {
    key: fs.readFileSync('./.ssl/privatekey.pem'),
    cert: fs.readFileSync('./.ssl/certificate.pem'),
};

let server = https.createServer(options, app).listen(443, function(){
  console.log("Express server listening on port " + 443);
});