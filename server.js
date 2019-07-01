//require dependencies
var express = require("express");
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

//Listen on PORT
app.listen(PORT, function() {
    console.log("Listening on port:" + PORT);
});