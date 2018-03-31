var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// creating Comment schema
var commentSchema = new Schema({
    username : {
        type: String,
        required: [true , 'Please enter your name']
    },
    commentDesc : {
      type: String,
      required: [true , 'Please enter comment']
  }
});

// exporting Comment module
module.exports = mongoose.model("Comment", commentSchema);
