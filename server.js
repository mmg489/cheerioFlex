// require dependencies 
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

// set up port to the host port or 3000
var PORT = process.env.PORT || 3000;

//initiate express app
var app = express();

//set up express router
var router = express.Router();

//require routes file to pass router object
require("./config/routes")(router);

//designate public folder as static directory
app.use(express.static(__dirname + "/public"));

//connect handlebars
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");


//use bodyParser
app.use(bodyParser.urlencoded({
    extended: false
}));

//make every request go through router middleware
app.use(router);

// if deployed use the deployed database else use local mongoheadlines database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//connect mongoose to database
mongoose.connect(db, function(error){
    //log any errors in connecting
    if (error) {
        console.log(error);
    }
    //or log connection message
    else {
        console.log("mongoose connection successful");
    }
});

//listen on port
app.listen(PORT, function(){
    console.log("Listening on port:" + PORT);
});