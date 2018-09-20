var mongoose = require("mongoose");

//ref to schema construct
var Schema = mongoose.Schema;

//noteSchema object
var NoteSchema = new Schema({
    title: String,
    body: String
});

//creates model from schema, using mongoose
var Note = mongoose.model("Note", NoteSchema);

//export model
module.exports = Note;