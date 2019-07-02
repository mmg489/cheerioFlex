//Global bootbox 
$(document).ready(function(){
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", "scrape-new", handleArticleScrape);
    initPage();

    function initPage(){
        articleContainer.empty();
        $.get("/api/headlines?saved=false")
            .then(function(data){
                if (data && data.length){
                    renderArticles(data);
                }
                else{
                    renderEmpty();
                }
            });
    }

    function renderArticles(articles){
        //function handles appending HTML containing article data to the page
        //passing an array of JSON containing all available articles in our DB
        var articlePanels = [];
        //pass each article JSON object to the createPanel functino which returns a bootstrap panel with article data inside
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        //once we have all of the HTML for the articles stored in our articlePanels array, append them to the articlePanels container
        articleContainer.append(articlePanels);
    }

    function renderEmpty() {
        //function renders some HTML to the page explaining there are no articles to view
        //Using a joined array of HTML string data b/c it is easier to read/change than a concatenated string
        var emptyAlert = 
        $(["<div class='aler alert-warning text-center'>",
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
})