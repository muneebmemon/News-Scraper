var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

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

module.exports = router;