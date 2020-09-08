const express = require('express');
const axios = require('axios');
const logger = require('morgan');

const router = express.Router();

router.get('/', (req, res) => {
    const options = createRedditOptions();

    //Get top 20 from the r/food subreddit
    const url = "https://" + options.hostname+options.path

    axios.get(url)
        .then( (rsp) => {
            const { data } = rsp;
            console.log(url)

            res.render("Reddit_display", { posts: data.data.children});
            res.end();
        })
        .catch((error) => {
            console.error(error);
        })
});

function createRedditOptions() {
    const options = {
        hostname: 'www.reddit.com',
        port: 443,
        path: '/r/food/.json?',
        method: 'GET',
    }

    return options;
}

module.exports = router;