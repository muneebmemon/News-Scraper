var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var db = require('../models');

var router = new express.Router;

// setting up home route
router.get('/', (req , res) => {

    // scraping articles
    // Make a request for the news section of `Chicago Tribune`
  request('https://www.chicagotribune.com', function(error, response, html) {
        
  // Load the html body from request into cheerio
        let $ = cheerio.load(html);
        var articles = [];           //empty array for saving article objects

        $('.trb_outfit_group_list_item_body').each(function(i, element) {
        
        let article = {};          //object for saving single article

        // Saving headline, url and short summary of each link enclosed in the current element
        let headline = $(element)
            .children('.trb_outfit_relatedListTitle')
            .children('.trb_outfit_relatedListTitle_a')
            .text();
        let url = $(element)
            .children('.trb_outfit_relatedListTitle')
            .children('.trb_outfit_relatedListTitle_a')
            .attr('href');
        let summary = $(element)
            .children('.trb_outfit_group_list_item_brief')
            .text();
        
        if(headline && url && summary){
            article.headline = headline;
            article.url = url;
            article.summary = summary;
            articles.push(article);
        }
        
        });

        res.render('home' , {data: articles});
  });    
});

// route for saved articles
router.get('/savedarticles' , (req,res)=>{
    db.Article.find()
      .then(articles=>{
        res.render('savedarticles', {data:articles});
      })
      .catch(err=>{
        res.status(400).json(err);
      });
});

// route for getting comments
router.get('/getcomments/:id' , (req , res)=>{
    db.Article.findById(req.params.id , '-summary')
      .populate('comments')
      .then(article=>{
          res.status(200).json(article);
      })
      .catch(err=>{
          res.status(400).json("{'status':'error'}");
      });
});

// route for saving articles in the database
router.post('/savethearticle' , (req,res)=>{
    db.Article.create(req.body)
      .then(article=>{
          res.status(200).json("{'status':'added'}");
      })
      .catch(err=>{
          res.status(400).json("{'status':'not added'}");
      });
});

// route for delete articles from database
router.post('/deletethearticle' , (req,res)=>{
    db.Article.findOneAndRemove({url:req.body.url})
      .then(article => {
        res.status(200).json("{'status':'deleted'}");
      })
      .catch(err => {
        res.status(400).json("{'status':'not deleted'}");
      });
});

// route for saving comments to database
router.post('/submitcomments' , (req,res)=>{
    var commentData = {username:req.body.username,commentDesc:req.body.commentDesc};
    db.Article.findOneAndUpdate({'_id':req.body.id},{$push:{comments: commentData}}, {new:true})
      .then(article => {
        res.status(200).json(article);
      })
      .catch(err => {
        res.status(400).json("{'status':'not added'}");
      });
});

// route for delete comments
router.delete('/delcomments/:aID/:cID' , (req,res)=>{
    db.Article.findOneAndUpdate({ 'comments._id': req.params.cID }, { $pull: { 'comments': { '_id': req.params.cID }}} , {new:true})
      .then(article => {
        res.status(200).json(article);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json("{'status':'not deleted'}");
      });
    
});

module.exports = router;