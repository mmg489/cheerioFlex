//Global Bootbox//
$(document).ready(function() {
    //getting a reference to the article container div that articles will be rendered in
    var articleContainer = $(".article-container");
    //event listeners for dynamically generated buttons for deleting articles
    //pulling up article notes, saving article notes, and deleting article notes
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    //initPage kicks everything off when page is loaded
    initPage();

    function initPage(){
        //empty article container, run AJAX req for saved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function(data){
            //if there are headlines, render them to page
            if (data && data.length){
                renderArticles(data);
            } else {
                //otherwise render msg explaining there are no articles
                renderEmpty();
            }
        });
    }

    function renderArticles(articles){
        //function handles appending HTML containing article data
        //passed an array of JSON containing all available articles in our DB
        var articlePanels = [];
        //pass each article JSON object to the createPanel function returns a bootstrap panel with article data
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        //once all of the HTML for the articles is stored in the articlePanels array
        //append to articlePanels container
        articleContainer.append(articlePanels);
    }

    function createPanel(article) {
        //function that takes single JSON Object for an article
        //constructs a jQuery element containing formatted HTML for the article panel
        var panel =
        $(["<div class='panel panel-default'>",
            "<div class='panel-heading'>",
            "<h3>",
            article.headline,
            "<a class='btn btn-danger delete'>",
            "Delete from Saved",
            "</a>",
            "<a class='btn btn-info notes'>Article Notes</a>",
            "</h3>",
            "</div>",
            "<div class='panel-body'>",
            article.summary,
            "</div>",
            "</div>"
        ].join(""));
        //attach the article's id to the jQuery element
        //used when trying to identify the article the user wants to remove or open notes for
        panel.data("_id", article._id);
        //return the constructed panel jQuery element
        return panel;
    }

    function renderEmpty() {
        //function renders some HTML to the page explaining there are not articles to view
        var emptyAlert =
        $(["<div class='alert alert-warning text-center'>",
            "<h4> Looks like we don't have any saved articles!</h4>",
            "</div>",
            "<div class= 'panel panel-default'>",
            "<div class= 'panel-heading text-center'>",
            "<h3> Would you like to browse available articles?</h3>",
            "</div>",
            "<div class='panel-body text-center'>",
            "<h4><a href='/'>Browse Articles</a></h4>",
            "</div>",
            "</div>"
        ].join(""));
        //appending data to the page
        articleContainer.append(emptyAlert);
    }

    function renderNotesList(data){
        //this function renders note list items to the notes modal
        //sets up an array of notes to render after finished
        //sets up a currentNote variable to temp store each note
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length){
            //if we have no notes, display a message explaining that
            currentNote= [
                "<li class='list-group-item'>",
                "No notes for this article yet.",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
        else {
            //if we do have notes, go through each one
            for (var i = 0; i <data.notes.length; i++) {
                //construct an li element to contain noteText and delete btn
                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));
                //store the note id on the delete button for easy access when attempting to delete
                currentNote.children("button").data("_id", data.notes[i]._id);
                //adding currentNote to the notesToRender array
                notesToRender.push(currentNote);
            }
        }
        //append the notesToRender to the note-container inside the note modal
        $(".note-container").append(notesToRender);
    }

    function handleArticleDelete(){
        //function deletes article/headlines, grabs id of article to delete the panel element
        //delete button sits inside
        var articleToDelete = $(this).parents(".panel").data();
        //use delete method 
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function(data){
            //run initPage to rerender list of saved articles
            if (data.ok) {
                initPage();
            }
        });
    }

    function handleArticleNotes(){
        //function for appending the notes modal and displaying the notes
        //grab id of article to get notes from the panel element 
        var currentArticle = $(this).parents(".panel").data();
        //grab any notes with this headline/article id
        $.get("/api/notes/" + currentArticle._id).then(function(data){
            //construct initial HTML to add notes modal
            var modalText = [
                "<div class= 'container-fluid text-center'>",
                "<h4>Notes for Article: ",
                currentArticle._id,
                "</h4>",
                "<hr />",
                "<ul class= 'list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols= '60'></textarea>",
                "<button class='btn btn-success save'>Save Note</button>",
                "</div>"
            ].join("");
            //adding the formatted HTML to the note modal
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            //adding info about the article and notes to the save btn for easy access
            //when trying to add a new note:
            $(".btn.save").data("article", noteData);
            //renderNotesList will populate the actual note HTML inside of the modal
            renderNotesList(noteData);
        });
    }

    function handleNoteSave(){
        //function handles user trying to save a new note for an article
        //sets a var to hold some formatted data about our note, grabs the note typed into the input box
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();
        //if data is typed into note input, it'll be formatted, posted, and sent into the /api/notes route 
        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function(){
                //when complete, close modal
                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete() {
        //function deletes notes, first grabs id of the desired note, stores this data on the delete btn
        var noteToDelete = $(this).data("_id");
        //perform DELETE req to "/api/notes/" with the id of the note we're deleting as a parameter
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function() {
            //when done, hide modal
            bootbox.hideAll();
        });
    }

});