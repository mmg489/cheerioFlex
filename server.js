//require dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

//set up port 
var PORT = process.env.PORT|| 3000;

//instantiate express app
var app = express();

//set up express router
var router = express.Router();

//Designate public folder as a static directory
app.use(express.static(__dirname + "/public"));

//Connect Handlebars to our express app
app.engine("handlebars",expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//use bodyParser in our app
app.use(bodyParser.urlencoded({
    extended:false
}));

//Have all requests go through router middleware
app.use(router);
//if deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//connect mongoose to our database
mongoose.connect(db, function(error){
    //log any errors connecting with mongoose
    if (error) {
        console.log(error);
    }
    //or log a success message
    else {
        console.log("mongoose connection is successful");
    }
});
//Listen on PORT
app.listen(PORT, function() {
    console.log("Listening on port:" + PORT);
});