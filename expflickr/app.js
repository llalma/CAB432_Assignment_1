const express = require('express');
const fs = require('fs');
const flickrRouter = require('./routes/flickr');
const app = express();
const hostname = '127.0.0.1';
const port = 3000;

app.get('/', (req, res) => {
        res.writeHead(200,{'content-type': 'text/html'});
        fs.readFile('index.html', 'utf8', (err, data) => {
        if (err) {
            res.end('Could not find or open file for reading\n');
        } else {
            res.end(data);
        }
    });
});

app.use('/search',flickrRouter);

app.listen(port, function () {
    console.log(`Express app listening at http://${hostname}:${port}/`);
});