var express   = require('express')
var products  = express.Router()
var scrape    = require('../includes/scrape')

/* GET home page. */
products.get('/:url', function(req, res, next) {
  console.log(req.params)
  scrape.tactics(req.params.url)
  .then((data) => res.json(data))
})

module.exports = products
