// Controller for Notes
///======================

var Note = require("../models/Note");
var makeDate = require("../scripts/date");

module.exports = {
    //get function that grabs all notes associated with the articles
    // we don't start with a fetch function because we arent scraping note data in, all is created by the user
    get: function(data, cb) {
        Note.find({
            _headlineId: data._id
        }, cb);
    },
    save: function(data, cb) {
        var newNote = {
            _headlineId: data._id,
            date: makeDate(),
            noteText: data.noteText
        };

        Note.create(newNote, function (err, doc) {
            if(err) {
                console.log(err);
            }
            else {
                console.log(doc);
                cb(doc);
            }
        });
    },
}