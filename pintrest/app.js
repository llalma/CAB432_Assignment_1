const express = require('express');
const fs = require('fs');
const path = require("path");

const redditHomeRouter = require('./routes/reddit_no_search');
const redditSearchRouter = require('./routes/reddit_search');
const edamamRouter = require('./routes/edamam');
const foodNutritionRouter = require('./routes/nutrition');

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

//Homepage of r/food
app.use('/',redditHomeRouter);

//For searching r/food
app.use('/search/',redditSearchRouter);

//For searching recipes
app.use("/edamam", edamamRouter);

//For nutrion of specific food items
app.use("/nutrition", foodNutritionRouter);



app.listen(port, function () {
    console.log(`Express app listening at http://${hostname}:${port}/`);
});