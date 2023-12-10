const mysql = require('mysql');

const con2 = mysql.createConnection({
    host: '192.168.178.45',
    user: 'streameroptions',
    password: '1i3XQ95c',
    database: 'streamer_options'
});

con2.connect();

con2.query('SELECT * FROM points WHERE viewerId = 2', function (error, results, fields) {
    if (error) throw error;
    //console.log(results[0].viewerId)
    if(results[0] !== undefined && results[0].viewerId !== undefined) {
        console.log('efsefsef')
    }
  });

  con2.end();