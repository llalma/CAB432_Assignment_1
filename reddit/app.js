const express = require('express');
const fs = require('fs');
const path = require("path");
var timeout = require('connect-timeout');

const redditHomeRouter = require('./routes/reddit');
const edamamRouter = require('./routes/edamam');
const foodNutritionRouter = require('./routes/nutrition');
const app = express();
const hostname = '127.0.0.1';
const port = 3000;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

//r/food router, handles searching and default aswell as paging
app.use('/',redditHomeRouter);


//For searching recipes
app.use("/edamam", edamamRouter);

//For nutrion of specific food items
app.use("/nutrition", foodNutritionRouter);

//Error handiling for unexpected URLS, just catches everything that doesnt get caught by another statement.
app.get('*', function(req, res) {

    //Render unexpected error page
    res.render("unexpectedError");
})

//Set time out of 30 seconds. if Nothing is returned in that time display time out page. should prevent postman of messin gup results
app.use(timeout(30000));
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next){
   if (!req.timedout) {
    res.render("timeout")    
    next();
   }
}


app.listen(port, function () {
    console.log(`Express app listening at http://${hostname}:${port}/`);
});