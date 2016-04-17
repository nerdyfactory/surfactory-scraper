var scraperjs = require('scraperjs')
var _         = require('lodash')
var Promise   = require('bluebird')


function tactics(url) {
  return new Promise((resolve, reject) => {
    scraperjs.StaticScraper.create(url)
    .scrape(($) => {
      $('head script').each((i, el) => {
        if (!_.isEmpty(el.children) && /app\.product\.init/.test(el.children[0].data)) {
          initScript = el.children[0].data
          return
        }
      })
      result = /app\.product\.init([^;]+)/.exec(initScript)
      str = result[1].replace(/\' style=[^\']+\'\,/g, "").replace(/\(/, "[").replace(/\)$/, "]").replace(/\'/g, "\"")
      console.log(str)
      json = JSON.parse(str)

      productId = json[0]
      variantInfos = json[1]
      imageInfos = json[2]
      defaultImage = json[9]

      // variants data
      variants = _.reduce(variantInfos, (variants, variant) => {
        variants.push({
          size: variant[0],
          color: variant[1],
          price: variant[2],
          old_price: variant[3],
          // address of bigger images
          images: _.map(imageInfos[variant[1]], (image) => "http://www.tactics.com" + image[2].replace(/(.*\/)(a)(\/.*\.jpg)/, "$12$3"))
        })
        return variants
      }, [])
      
      // product attributes
      attributes = {}
      $('.product-features-spec-summary-row').each((i, el) => {
        attrName = $(el).find('.product-features-spec-summary-name').first().text().replace(/\:$/, "")
        if ($(el).find('.product-features-spec-summary-value li').length == 0) {
          attrValues = [$(el).find('.product-features-spec-summary-value').first().text()]
        } else {
          attrValues = $(el).find('.product-features-spec-summary-value li').map((i, ele) => $(ele).text()).get()
        }
        attributes[attrName] = attrValues
      })

      //category
      category = $('.breadcrumbs a').not('.breadcrumb-x').map((i, el) => {
        return $(el).text()
      })

      product = {
        id: productId,
        url: url,
        name: $('.product-h1').text(),
        brand: $('.product-h1-brand').text(),
        description: $('.product-features-description').text(),
        attributes: attributes,
        variants: variants,
        category: [category[0], category[1], category[2]]
      }
      console.log(JSON.stringify(product))
      return product
    }).then((product) => resolve(product))
    .catch((error) => {
      console.log("scraping failed:" + url)
      return reject(error)
    })
  })
}

module.exports = tactics
