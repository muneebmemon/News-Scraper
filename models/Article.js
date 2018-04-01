var mongoose = require('mongoose');

var Schema = mongoose.Schema;

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
    commments : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

// exporting Article module
module.exports = mongoose.model('Article' , articleSchema);