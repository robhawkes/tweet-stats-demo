# Tweet Stats

Realtime statistics on Twitter keywords

Demo: [http://tweet-stats.herokuapp.com](http://tweet-stats.herokuapp.com/)

[![](http://cl.ly/image/3G0C1e3I2y43/tweet-stats.jpg)](http://tweet-stats.herokuapp.com/)


## Getting up and running

1. [Set up the API](https://github.com/robhawkes/tweet-stats-api) and make sure it's running
2. Install the server dependencies by running `npm install`
3. Install the front-end dependencies by running `bower install`
4. [Change the Pusher application key](https://github.com/robhawkes/tweet-stats-demo/blob/master/public/js/dashboard.js#L7) in `/public/js/dashboard.js`
5. [Change the API endpoint](https://github.com/robhawkes/tweet-stats-demo/blob/master/public/js/dashboard.js#L8) in `/public/js/dashboard.js`
6. Test the demo locally by running `node index.js` and [checking the graphs](http://localhost:5002)
7. Upload the API somewhere public