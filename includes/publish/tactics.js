var scraperjs = require('scraperjs')
var _         = require('lodash')
var Promise   = require('bluebird')
var request = Promise.promisifyAll(require('request'))


function getProductUrls(url) {
  return new Promise((resolve, reject) => {
    scraperjs.StaticScraper.create(url)
    .scrape(($) => {
      return $('.browse-grid-item a').map((i, el) => 'http://tactics.com' + $(el).attr('href')).get()
    }).then((urls) => resolve(urls))
    .catch((error) => reject(error))
  })
}

function sendApiRequest(url) {
  apiUrl = 'http://localhost:3000/products/' + encodeURIComponent(url)
  console.log(apiUrl)
  return request.getAsync(apiUrl)
  .then((response) => {
    console.log(response.body)
  })
}

function tactics(list) {
  return Promise.map(list, getProductUrls)
  .then((urls) => {
    return _.flatten(urls)
  }).map(sendApiRequest, {concurrency: 1})
}

module.exports = tactics
