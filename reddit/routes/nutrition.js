const express = require('express');
const axios = require('axios');
const logger = require('morgan');

const router = express.Router();

router.get('/item/:query', (req, res) => {
    const options = createRecepieOptions(req.params.query);

    const url = `https://${options.hostname}${options.path}`;

    console.log(url)

    axios.get(url)
        .then( (rsp) => {
            const { data } = rsp;

            // res.json("hello")
            res.send({data: data.hints[0]})

            
            // //Only get first one, as it will hopefull be the closest one. could show all with a loop if needed though. would be similar to recipes or reddit though.
            // res.render("nutrition", { item: data.hints[0]})
        })
        .catch((error) => {
            console.log(error)
            res.render("No_Recipes_avaliable")
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