const express = require('express');
const axios = require('axios');
const logger = require('morgan');

const router = express.Router();

router.get('/food/:query/:selected', (req, res) => {
    const options = createRecepieOptions(req.params.query);

    const url = `https://${options.hostname}${options.path}`;
    // const nextURL = `https://${options.hostname}${options.path}&from=${parseInt(options.start)+10}`;
    // const prevURL = `https://${options.hostname}${options.path}&from=${parseInt(options.start)-10}`;

    console.log(url)

    axios.get(url)
        .then( (rsp) => {
            const { data } = rsp;
            // res.json({data})
            if(data.hits.length > 0){
                res.render("recipe_overall", { recipes: data.hits, selected_index:parseInt(req.params.selected)})
            }else{
                res.render("No_Recipes_avaliable")
            }
        })
        .catch((error) => {
            res.render("No_Recipes_avaliable")
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
    '&app_key=' + recipe_search.app_key +
    '&from=0' + 
    '&to=40';

    options.path += str;
    return options;
}

module.exports = router;