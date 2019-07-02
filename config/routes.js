module.exports= function(router) {
    //this route renders the homepage
    router.get("/", function(req,res) {
        res.render("home");
    });
    // This route renders the saved handlebars page
    router.get("/saved", function(req,res) {
        res.render("saved");
    });
}