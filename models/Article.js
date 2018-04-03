var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// creating Comment schema
var commentSchema = new Schema({
    username : {
        type: String,
        trim: true,
        required: [true , 'Please enter your name']
    },
    commentDesc : {
      type: String,
      trim: true,
      required: [true , 'Please enter comment']
  }
});

// creating Article schema
var articleSchema = new Schema({
    headline : {
        type: String,
        required: [true, 'Headline is required']
    },
    summary : {
        type: String,
        required: [true, 'Summary is required']
    },
    url : {
        type: String,
        unique: true,
        trim: true
    },
    comments : [commentSchema]
});

// exporting Article module
module.exports = mongoose.model('Article' , articleSchema);