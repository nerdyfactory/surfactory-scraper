var express   = require('express')
var products  = express.Router()
var tactics   = require('../includes/scrape').tactics

/* GET home page. */
products.get('/:url', function(req, res, next) {
  console.log(req.params)
  tactics.scrape(req.params.url, (data) => {
    console.log(data)
    res.json({})
  })
})

module.exports = products
