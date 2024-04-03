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
const devMonitorRouter = require('./routes/devMonitor');
const guideRouter = require('./routes/guides');
const apiRouter = require('./routes/api');
const serverStatsFunctions = require('./functions/serverStatsFunctions');
const { isDevMode } = require('./data/dev.json');
const websocket = require('./functions/websocket')
const mailFunctions = require('./functions/mailFunctions');
const database = require('./functions/sql');
const logger = require('./logging');


webTitle = 'Streamer Options'
hostname = 'https://streameroptions.com'

database.initializePool();

app.set('x-powered-by', false)
app.use(security.onlyAllowCloudflare);
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))

app.set('view engine', 'ejs');

app.use('/users', userRouter);
app.use('/streamer', streamerRouter);
app.use('/events', eventRouter);
app.use('/', devMonitorRouter);
app.use('/', guideRouter);
app.use('/api/v1', apiRouter);

app.use('/', mainRouter); // this router should be last.

/*

This should be the absolute last route, 
if there hasnt been a response by now this will send a 404.

*/

app.route('*').get((req, res) => {
  res.status(404).render(
    '404notfound',
    {
      WebsiteTitleElementText: webTitle + ' - Not Found',
      hostname: hostname,
      CssUrl: hostname + '/stylesheet10.css',
    }
  );
});

/*

Log ExpressJS errors, and handle them.

*/

app.use((err, req, res, next) => {
  logger.error(err)
  res.status(500).send({ error: 'Please try again later.' })
})

checkPoints.start();
websocket.init();

const fs = require('fs'),
  http = require('http'),
  https = require('https');

const options = {
  key: fs.readFileSync('./.ssl/privatekey.pem'),
  cert: fs.readFileSync('./.ssl/certificate.pem'),
};

let server = https.createServer(options, app).listen(8080, function () {
  serverStatsFunctions.start();
  if (isDevMode) {
    console.log("Express server listening on port " + 8080);
    console.log("Open the website -> " + hostname);
  } else {
    console.log("Streamer Options is now online. Time: " + Date.now());
  }
});


//mailFunctions.sendMonthlyStatisticsMailToAll("no")