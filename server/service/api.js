const axios = require('axios')

const GET = (baseURL, metricSelector, normalize) => {
  // console.log('normalize: ', normalize);
  // console.log('metricSelector: ', metricSelector);
  // console.log('baseURL: ', baseURL);

  return axios
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
}

module.exports = {
  GET
}
