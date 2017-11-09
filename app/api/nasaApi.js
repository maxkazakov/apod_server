const axios = require("axios")
const apiKey = process.env.NASA_API_KEY
const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=`

const getPictures = date => {
    return axios.get(url + date).then(res => res.data)
}

exports.getPictures = dates => {
    return Promise.all(dates.map(date => getPictures(date)))
}
