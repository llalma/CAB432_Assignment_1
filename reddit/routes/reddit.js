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

            console.log(req.query.dir)
            if(req.query.dir == undefined){
                res.render("reddit_display", { posts: data.data.children,before: null ,after: data.data.after});
            }else{
                if(data.data.children.length > 0){
                    res.render("reddit_display", { posts: data.data.children,before: data.data.before ,after: data.data.after});
                }else{
                    res.render("No_posts", { before: data.data.before ,after: data.data.after});
                }
            }
            
            res.end();
        })
        .catch((error) => {
            console.error(error);
        })
});

function createRedditOptions(after,before,dir,searchq) {
    const options = {
        hostname: 'www.reddit.com',
        port: 443,
        path: `/r/food/`,
        path_noSearch: 'search.json?',
        path_Search: '.json?',
        method: 'GET',
    }

    if(searchq != undefined){
        options.path += options.path_noSearch + 
                        "restrict_sr=on" +
                        "&q="+ searchq
    }else{
        options.path += options.path_Search
    }

    if(dir === "forward"){
        options.path += "&after=" + after
    }else{
        options.path += "&before=" + before
    }   

    options.path += "&count=20"
    
    console.log(options.path)

    return options;
}

module.exports = router;