var scraperjs = require('scraperjs')

function tacticsCategory(url, callback) {
  console.log(url)
  scraperjs.StaticScraper.create(url)
  .scrape(($) => {
    categoryList = []
    
    $('.central-category-list').each((i, el) => {
      header = $(el).find('a.central-category-header').first().text()
      $(el).find('.central-category-sub').not('.central-category-sub-all').each((i, ele) => {
        categoryList.push({
          category: header + ">" + $(ele).text(),
          url: "http://tactics.com" + $(ele).attr('href')
        })
      })
    })
    return categoryList
  }, callback)
}

module.exports = tacticsCategory
if (require.main == module) {
  if (process.argv[2]) {
    tacticsCategory(process.argv[2], (res) => {
      console.log(JSON.stringify(res))
      process.exit(0)
    })
  } else {
    console.log("Usage: node tacticsCategory url")
    process.exit(1)
  }
}
