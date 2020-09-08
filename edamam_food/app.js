const express = require('express');
const fs = require('fs');
const path = require("path");

const edamamRouter = require('./routes/food');

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
        res.writeHead(200,{'content-type': 'text/html'});
        fs.readFile('index.html', 'utf8', (err, data) => {
        if (err) {
            res.end('Correctly broken\n');
        } else {
            res.end(data);
        }
    });
});

app.use('/search',edamamRouter);

app.listen(port, function () {
    console.log(`Express app listening at http://${hostname}:${port}/`);
});