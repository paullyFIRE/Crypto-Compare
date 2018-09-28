const axios = require('axios')

const apiCall = (baseURL, metricSelector) =>
  axios
    .get(baseURL)
    .then(metricSelector)
    .catch(err => console.log('error', err.message))

module.exports = {
  apiCall
}
