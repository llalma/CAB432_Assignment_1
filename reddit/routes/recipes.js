const express = require('express');
const axios = require('axios');
const logger = require('morgan');
const { format } = require('morgan');

const router = express.Router();

router.get('/food/:query', (req, res) => {
    const options = createRecepieOptions(req.params.query,req.query.selected,req.query.from,req.query.to);

    const url = `https://${options.hostname}${options.path}`;


    if(req.query.selected == undefined){
        //Just show all recipes with no selected
        axios.get(url)
        .then( (rsp) => {
            const { data } = rsp;

            if(data.hits.length > 1){
                res.render("recipe_overall", { recipes: data.hits, query: req.params.query, from: data.from, to: data.to})
            }else{
                res.render("No_Recipes_avaliable")
            }
        })
        .catch((error) => {
            console.log(error)
            res.render("No_Recipes_avaliable")
        })
    }else{
        //A recipe is selected. get a recipe and send back ingredients ect
        axios.get(url)
        .then( (rsp) => {
            const { data } = rsp;

            res.send(data[0])
            res.end()
        })
        .catch((error) => {
            console.log(error)
            res.render("No_Recipes_avaliable")
        })
    }
});

//Information about the API
const recipe_search = {
    method: 'search',
    app_id: "a48ce52c",
    app_key: "bf4c7cc92afc5e302d35489673d0b095",
};

var removeUselessWords = function(txt) {
    //Remove common words from the search term as they do no assist in finding recipes
    var uselessWordsArray = 
        [
          "a", "at", "be", "can", "cant", "could", "couldnt", 
          "do", "does", "how", "i", "in", "is", "many", "much", "of", 
          "on", "or", "should", "shouldnt", "so", "such", "the", 
          "them", "they", "to", "us",  "we", "what", "who", "why", 
          "with", "wont", "would", "wouldnt", "you"
        ];
			
	  var expStr = uselessWordsArray.join("|");
	  return txt.replace(new RegExp('\\b(' + expStr + ')\\b', 'gi'), ' ')
                    .replace(/\s{2,}/g, ' ');
  }

function createRecepieOptions(query,selectedRecipe,from,to) {
    const options = {
        hostname: 'api.edamam.com',
        port: 443,
        path: '/search?',
        method: 'GET',
    }

    var str = "";

    //If a specific recipe has been selected and needs to return ingredients ect.
    if(selectedRecipe != undefined){
        str = "r="+ encodeURIComponent(selectedRecipe) +
        '&app_id=' + recipe_search.app_id +
        '&app_key=' + recipe_search.app_key;
    }else{
        //General search query to return a list of ingredients matching the query.
        
        //Remove common words from title before querying it.
        query = removeUselessWords(query)

        str = "q="+ query +
        '&app_id=' + recipe_search.app_id +
        '&app_key=' + recipe_search.app_key 
    }
    
    //Paging
    if(from == undefined){
        str += '&from=0' + 
        '&to=10';
    }else{
        str += '&from=' + from 
        + '&to=' + to;
    }


    options.path += str;
    return options;
}

module.exports = router;