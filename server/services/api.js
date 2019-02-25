const axios = require('axios')
const x = require('x-ray')()
const cloudscraper = require('cloudscraper')
const makeDriver = require('request-x-ray')

const headers = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'cache-control': 'max-age=0',
    cookie:
      '__cfduid=d1bb5ccd1057d379ae449e311beee08151539584394; ALTSECURE=d068q3leok2u69adgnit9o24d5; _ga=GA1.3.1039317435.1539584418; _gid=GA1.3.1166078299.1542542247; cf_clearance=94f8cb6b9d5f106a3d2c6929fbe071bc9d3d1fe9-1542550600-300-150; _gat=1'
  }
}

const driver = makeDriver(headers)
x.driver(driver)

const GET = (baseURL, metricSelector, normalize) =>
  axios
    .get(baseURL)
    .then(metricSelector)
    .then(data => {
      if (!normalize) return data

      if (typeof data === 'number') {
        return normalize(data)
      }

      return data.map(normalize)
    })
    .catch(err => console.log('error', err.message))

const SCRAPE = (baseURL, parser) =>
  new Promise((resolve, reject) => {
    cloudscraper.get(baseURL, async function(error, response, body) {
      if (error) {
        reject(error)
      }

      const askOrders = await parser(body)

      resolve(askOrders)
    })
  })

module.exports = {
  GET,
  SCRAPE,
  x
}
