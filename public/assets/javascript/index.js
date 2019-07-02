//Global bootbox 
$(document).ready(function(){
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);
    initPage();

    function initPage(){
        console.log('init called')
        articleContainer.empty();
        $.get("/api/headlines?saved=false")
            .then(function(data){
                //if there are headlines, they are rendered to the page
                if (data && data.length){
                    renderArticles(data);
                }
                else {
                    //renders a message that there are no articles
                    renderEmpty();
                }
            });
    }

    function renderArticles(articles){
        //function handles appending HTML containing article data to the page
        //passing an array of JSON containing all available articles in our DB
        var articlePanels = [];
        console.log(articles);
        //pass each article JSON object to the createPanel functino which returns a bootstrap panel with article data inside
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        //once we have all of the HTML for the articles stored in our articlePanels array, append them to the articlePanels container
       articlePanels.forEach(articlePanel => {
           $(".article-container").append(articlePanel);
       });
    }

    function createPanel(article) {
        //this function takes a single JSON object for an article/headline
        //constructs a jQuery element containing all of the formatted HTML for the article panel
        var panel =
        $(["<div class='panel panel-default'>",
            "<div class='panel-heading'>",
            "<h3>",
            article.headline,
            "<a class= 'btn btn-sucess save'>",
            "Save Article",
            "</a>",
            "</h3>",
            "</div>",
            "<div class='panel-body'>",
            article.summary,
            "</div>",
            "</div>"
        ].join(""));
        //attach the article's id to the jQuery element
        //use this when trying to find which article the user wants to save
        panel.data("_id", article._id);
        //return the constructed panel jQuery element
        return panel;
    }

    function renderEmpty() {
        //function renders some HTML to the page explaining there are no articles to view
        //Using a joined array of HTML string data b/c it is easier to read/change than a concatenated string
        var emptyAlert = 
        $(["<div class='alert alert-warning text-center'>",
            "<h4> Looks like we don't have any new articles!</h4>",
            "</div>",
            "<div class='panel panel-default'>",
            "<div class='panel-heading text-center'>",
            "<h3> What would you like to do?</h3>",
            "</div>",
            "<div class='panel-body text-center'>",
            "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
            "<h4><a href='/saved'>Go To Saved Articles</a></h4>",
            "</div>",
            "</div>"
        ].join(""));
        //appending this data to the page
        articleContainer.append(emptyAlert);
    }
    function handleArticleSave(){
        //function triggered when user wants to save an article
        //JS object containing the headline ID was initially attached when the article was rendered
        //this was done through the .data method, this will retrieve it
        var articleToSave = $(this).parents(".panel").data();
        articleToSave.saved = true;
        //this is an update to the existing record in the collection
        $.ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: articleToSave
        })
        .then(function(data){
            //if successful, mongoose will send back an object containing the key of "ok" with a value of 1, which casts to "true"
            if (data.ok) {
                //runs the initPage function again and reloads entire list of articles
                initPage();
            }
        });
    }

    function handleArticleScrape(){
        //this function handles the user clickin any scrape new article buttons
        
        $.get("/api/fetch")
            .then(function(data){
            //if scrape is successful, the articles are compared to current collection, and user is notified how many unique articles were able to be saved
                initPage();
                bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
        });
    }
});