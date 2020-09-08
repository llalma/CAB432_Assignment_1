const express = require('express');
const axios = require('axios');
const logger = require('morgan');

const router = express.Router();

router.get('/:query/:start', (req, res) => {
    const options = createRecepieOptions(req.params.query,req.params.start);

    const url = `https://${options.hostname}${options.path}&from=${options.start}`;
    const nextURL = `https://${options.hostname}${options.path}&from=${parseInt(options.start)+10}`;
    const prevURL = `https://${options.hostname}${options.path}&from=${parseInt(options.start)-10}`;

    axios.get(url)
        .then( (rsp) => {
            const { data } = rsp;
            console.log(url)
            res.render("recipe_display", { recipes: data.hits, nextURL: nextURL, prevURL: prevURL});
            res.end();
        })
        .catch((error) => {
            console.error(error);
        })
});

const recipe_search = {
    method: 'search',
    app_id: "a48ce52c",
    app_key: "bf4c7cc92afc5e302d35489673d0b095",
};

function createRecepieOptions(query,start) {
    const options = {
        hostname: 'api.edamam.com',
        port: 443,
        path: '/search?',
        method: 'GET',
        start: start
    }

    const numItems = 5  //Number of items to display on page
    const end = parseInt(start)+numItems

    const str = "q="+ query +
    '&app_id=' + recipe_search.app_id +
    '&app_key=' + recipe_search.app_key;

    options.path += str;
    return options;
}

module.exports = router;