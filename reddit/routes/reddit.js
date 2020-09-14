const express = require('express');
const axios = require('axios');
const logger = require('morgan');

const router = express.Router();

router.get('/', (req, res) => {

    const options = createRedditOptions(req.query.after,req.query.before,req.query.dir,req.query.search);

    //Get top 20 from the r/food subreddit
    const url = "https://" + options.hostname+options.path

    axios.get(url)
        .then( (rsp) => {
            const { data } = rsp;

            //The outer if statements assists in determining if this is the first page and the previous page button needs to be disabaled.
            if(req.query.dir == undefined){
                if(data.data.children.length > 0){
                    //Display if there are results
                    res.render("reddit_display", { posts: data.data.children,before: null ,after: data.data.after});
                }else{
                    //No results found
                    res.render("no_posts", { before: data.data.before ,after: data.data.after});
                }
            }else{
                if(data.data.children.length > 0){
                    res.render("reddit_display", { posts: data.data.children,before: data.data.before ,after: data.data.after});
                }else{
                    res.render("no_posts", { before: data.data.before ,after: data.data.after});
                }
            }
            
            res.end();
        })
        .catch((error) => {
            console.error(error);
            res.render("no_posts", { before: data.data.before ,after: data.data.after});
        })
});

function createRedditOptions(after,before,dir,searchq) {
    const options = {
        hostname: 'www.reddit.com',
        port: 443,
        path: `/r/food/`,
        path_Search: 'search.json?',
        path_noSearch: '.json?',
        method: 'GET',
    }

    //Determine if a search quer or just display top results.
    if(searchq != undefined){
        options.path += options.path_Search + 
                        "restrict_sr=on" +
                        "&q="+ searchq
    }else{
        options.path += options.path_noSearch
    }

    //Direction which drirection the results are moving, if previous gets the results before a certain post. Similar for after.
    if(dir === "forward"){
        options.path += "&after=" + after
    }else{
        options.path += "&before=" + before
    }   

    options.path += "&count=20"

    return options;
}

module.exports = router;