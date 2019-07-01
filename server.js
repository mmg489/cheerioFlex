//require dependencies
var express = require("express");
//set up port 
var PORT = process.env.PORT|| 3000;
//instantiate express app
var app = express();
//set up express router
var router = express.Router();
//Designate public folder as a static directory
app.use(express.static(__dirname + "/public"));
//Have all requests go through router middleware
app.use(router);
//Listen on PORT
app.listen(PORT, function() {
    console.log("Listening on port:" + PORT);
});