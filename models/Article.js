var mongoose = require("mongoose");

//ref. to schema constructor
var Schema = mongoose.Schema;

//create new userschema object
var ArticleSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },

    //stores note id
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

//creates model from schema, mongoose model method
var Article = mongoose.model("Article", ArticleSchema);

//export model
module.exports = Article;