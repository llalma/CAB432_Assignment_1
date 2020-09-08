const express = require('express');
const axios = require('axios');
const logger = require('morgan');

const router = express.Router();

router.get('/', (req, res) => {

    console.log(req.query.before)
    console.log(req.query.after)

    const options = createRedditOptions(req.query.after,req.query.before,req.query.dir);

    //Get top 20 from the r/food subreddit
    const url = "https://" + options.hostname+options.path

    console.log(url)

    axios.get(url)
        .then( (rsp) => {
            const { data } = rsp;

            res.render("Reddit_display", { posts: data.data.children,before: data.data.before ,after: data.data.after});
            res.end();
        })
        .catch((error) => {
            console.error(error);
        })
});

function createRedditOptions(after,before,dir) {
    const options = {
        hostname: 'www.reddit.com',
        port: 443,
        path: '/r/food/.json?',
        method: 'GET',
    }

    if(dir === "forward"){
        options.path += "&after=" + after
    }else{
        options.path += "&before=" + before
    }   

    options.path += "&count=20"
    

    return options;
}

module.exports = router;