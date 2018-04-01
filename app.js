var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// initializing express app
var app = express();

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = global.Promise;

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// setting up app port
const PORT = process.env.PORT || 3000;

// setting tamplate engine to EJS
app.set('view engine' , 'ejs');

// setting up middleware for static routes
app.use(express.static(path.join(__dirname , 'public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// setting up routes for app
app.use('/' , require('./routes/regularRoutes'));

// listening to port
app.listen(PORT , () => {
    console.log(`Listening at port : ${PORT}`);
});