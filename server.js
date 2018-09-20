var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// scraping tools

var axios = require("axios");
var cheerio = require("cheerio");

// gets all models
var db = require("./models");

var PORT = 3000;

var app = express();


// Use morgan logger for log requests
app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

//database connection
mongoose.connect("mongodb://localhost/News-Scraper", { useNewUrlParser: true });



// get route scrapes infowars
app.get("/scrape", function(req, res) {
  
  axios.get("https://www.infowars.com/").then(function(response) {
    //save for shorthand
    var $ = cheerio.load(response.data);

    //grab h3 tags
    $("h3").each(function(i, element) {
      
      var result = {};

      // text/hrefs for links
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // new articles created
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          //err handling
          return res.json(err);
        });
    });

    // success alert
    res.send("Scrape Complete");
  });
});

// articles from db
app.get("/articles", function(req, res) {
  // documents from articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // send back to client
      res.json(dbArticle);
    })
    .catch(function(err) {
      //err handling
      res.json(err);
    });
});

//view article by id with notes if any
app.get("/articles/:id", function(req, res) {
  //find matching articles to id
  db.Article.findOne({ _id: req.params.id })
    
    .populate("note")
    //populates article with associated notes
    .then(function(dbArticle) {
      // send article if found
      res.json(dbArticle);
    })
    .catch(function(err) {
      // err handling
      res.json(err);
    });
});

// route for saving/updating notes 
app.post("/articles/:id", function(req, res) {
  
  db.Note.create(req.body)
    .then(function(dbNote) {
     
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
     
      res.json(dbArticle);
    })
    .catch(function(err) {
      
      res.json(err);
    });
});

// server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
