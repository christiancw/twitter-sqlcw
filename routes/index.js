'use strict';
var express = require('express');
var router = express.Router();
var tweetBank = require('../tweetBank');
var client = require('../db/index.js');

module.exports = router;


// a reusable function
function respondWithAllTweets (req, res, next){
  // var allTheTweets = tweetBank.list();
  client.query('SELECT * FROM tweets', function (err, result) {
  if (err) return next(err); // pass errors to Express
  var tweets = result.rows;
  res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
});

  // res.render('index', {
  //   title: 'Twitter.js',
  //   tweets: allTheTweets,
  //   showForm: true
  // });
}

// here we basically treet the root view and tweets view as identical
router.get('/', respondWithAllTweets);
router.get('/tweets', respondWithAllTweets);

// single-user page
router.get('/users/:username', function(req, res, next){
  // var tweetsForName = tweetBank.find({ name: req.params.username });
  client.query('SELECT * FROM tweets INNER JOIN users ON users.id = tweets.user_id WHERE users.name=$1',
    [req.params.username],
    function (err, result) {
    if (err) return next(err); // pass errors to Express
    var tweets = result.rows;
    console.log(tweets);
    res.render('index', { title: 'Twitter.js', tweets, showForm: true });
  // res.render('index', {
  //   title: 'Twitter.js',
  //   tweets: tweetsForName,
  //   showForm: true,
  //   username: req.params.username
  });
});



// single-tweet page
router.get('/tweets/:id', function(req, res, next){
  // var tweetsWithThatId = tweetBank.find({ id: Number(req.params.id) });
  client.query('SELECT content FROM tweets WHERE id=$1',[req.params.id], function(err,result) {
    if (err) return next(err);
    var tweets = result.rows;
    console.log(tweets);
    res.render('index', { title: 'Twitter.js', tweets, showForm: true });
  })
  // res.render('index', {
  //   title: 'Twitter.js',
  //   tweets: tweetsWithThatId // an array of only one element ;-)
  // });
});

// var checkName = client.query("SELECT id FROM users WHERE name='Howard'", function (err, result) {
//   if (err) return next(err);
//   console.log(result);
// })

//INSERT FUNCTION
/*
client.query('INSERT INTO tweets (user_id, content) VALUES ($1,$2)', [param1,req.body.name], function(err,result) {

}
*/


// create a new tweet
router.post('/tweets', function(req, res, next){
  // var newTweet = tweetBank.add(req.body.name, req.body.content);
  //INSERT error checking to make sure req.body.name + req.body.content both are filled out
  client.query("SELECT id FROM users WHERE name=$1",[req.body.name], function (err, result) {
    if (err) return next(err);
    var checkName = result.rows;
    if(checkName.length === 0) {
      //INSERT function for USERS then Query and INSERT into tweets
      client.query('INSERT INTO users (name, picture_url) VALUE ($1,$2)', [req.body.name, null],function(err,result){
        if(err) return next(err);
        //START here
        client.query("SELECT id FROM users WHERE name=$1",[req.body.name], function (err, result) {
          if (err) return next(err);
          var checkName = result.rows;
          if(!checkName) {
            //INSERT function for USERS then Query and INSERT into tweets
            client.query('INSERT INTO users (name, picture_url) VALUE ($1,$2)', [req.body.name, null],function(err,result){
              if(err) return next(err);

            });
          } else {
            //INSERT function into tweets
            client.query('INSERT INTO tweets (user_id, content) VALUE ($1,$2)', [checkName,req.body.content],function(err,result){
              if(err) return next(err);
              var tweets = result.rows;
              res.render('index', { title: 'Twitter.js', tweets, showForm: true });
            });
          }
        }); //DELETE HERE


      });
    } else {
      //INSERT function into tweets
      client.query('INSERT INTO tweets (user_id, content) VALUE ($1,$2)', [checkName,req.body.content],function(err,result){
        if(err) return next(err);
        var tweets = result.rows;
        res.render('index', { title: 'Twitter.js', tweets, showForm: true });
      });
    }
  });
  res.redirect('/');
});

// // replaced this hard-coded route with general static routing in app.js
// router.get('/stylesheets/style.css', function(req, res, next){
//   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
// });
