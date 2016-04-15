var scraperjs = require('scraperjs');

var scrape = function (url, callback) {
  scraperjs.StaticScraper.create(url)
  .scrape(($) => {
    console.log("aa")
    return "bb"
  }, callback)
}

var tactics = {
  scrape: scrape
}

module.exports = tactics
