var pg = require('pg');


var postgresUrl = 'postgres://localhost/twitterdb';
var client = new pg.Client(postgresUrl);

// connecting to the `postgres` server
client.connect();

// client.query('SELECT * FROM tweets', function (err, result) {
//   if (err) return next(err); // pass errors to Express
//   var tweets = result.rows;
//   res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
// });
// make the client available as a Node module
module.exports = client;
