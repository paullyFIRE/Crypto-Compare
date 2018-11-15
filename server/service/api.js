const axios = require('axios')
const x = require('x-ray')()
const cloudscraper = require('cloudscraper')
const makeDriver = require('request-x-ray')

const options = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36'
  }
}

const driver = makeDriver(options)
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
