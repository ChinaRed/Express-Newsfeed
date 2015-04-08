var Newsfeed = require('../models/news');
var express = require('express');
var router = express.Router();


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
console.log("failed login");
}

router.list = function(req, res) {
  //calls all news in database
  Newsfeed.find(function (err, newsfeeds){
    if (err) throw err;
    // rendering jade template newsfeed and all news are passed in
    res.render('index', {
      newsfeeds : newsfeeds
    });  
  });
};

router.get('/admin', ensureAuthenticated, function (req, res) {
  Newsfeed.find(function (err, newsfeeds) {
    res.render('admin', {newsfeeds: newsfeeds}) ;
  });
});

//renders newsfeed page
router.get('/new_newsfeed', ensureAuthenticated, function(req, res) {
  Newsfeed.findOne({_id:req.params.id},
    function(err, newsfeeds) {
    res.render('new_newsfeed', {
      newsfeeds : newsfeeds
    });    
  });
});

//renders single post page
router.get('/:id'/*, ensureAuthenticated*/, function(req, res) {
  Newsfeed.findOne({_id:req.params.id},
    function(err, newsfeeds) {
    res.render('detail', {
      newsfeeds : newsfeeds
    });    
  });
});

//post newsfeed
router.post('/', function(req, res) {
  var newsfeed = new Newsfeed(
  {
    author : req.body.author,
    title : req.body.title,
    body : req.body.body,
    photoURL : req.body.photoURL
  });
  newsfeed.save(function(err){
    if (err) throw err;
    res.redirect("/newsfeeds/admin");
  });   
});

//edit page view
router.get('/edit/:id', ensureAuthenticated, function(req, res) {
  Newsfeed.findOne({_id:req.params.id},
    function(err, newsfeeds) {
    res.render('edit', {
      newsfeeds : newsfeeds
    });    
  });
});


router.get('/logout', function(req, res){
  res.redirect('/');
});

//edit newsfeed
router.put('/edit/:id', ensureAuthenticated, function(req, res) {
  Newsfeed.findOneAndUpdate({_id:req.params.id}, { $set:
  { 
    author : req.body.author,
    title : req.body.title,
    body : req.body.body,
    photoURL : req.body.photoURL
  }}, function (err, newsfeeds){
    if (err) throw err;
    res.redirect('/newsfeeds/admin');  
  });
});

//delete newsfeed
router.delete('/:id', ensureAuthenticated, function (req, res) {
  Newsfeed.find({_id:req.params.id}).remove().exec(function(err, newsfeed) {
    if (err) throw err;
    console.log("deleted");
  res.redirect('/newsfeeds/admin');  
  });
});

module.exports = router;