const express = require('express');
const axios = require('axios');
const logger = require('morgan');

const router = express.Router();

router.get('/item/:query', (req, res) => {
    const options = createRecepieOptions(req.params.query);

    const url = `https://${options.hostname}${options.path}`;

    axios.get(url)
        .then( (rsp) => {
            const { data } = rsp;

            console.log(data.hints[0])

            //Send results. Dont need to render as all results for this api are displayed with javascript.
            res.send({data: data.hints[0]})
        })
        .catch((error) => {
            console.log(error)
            res.render("no_nutrition")
        })
});

const recipe_search = {
    method: 'search',
    app_id: "f3543f45",
    app_key: "9e730a13068f9ae512e00d74d7fa9fa6",
};

function createRecepieOptions(query) {
    const options = {
        hostname: 'api.edamam.com',
        port: 443,
        path: '/api/food-database/v2/parser?',
        method: 'GET',
    }


    const str = "ingr="+ query +
    '&app_id=' + recipe_search.app_id +
    '&app_key=' + recipe_search.app_key;

    options.path += str;
    return options;
}

module.exports = router;