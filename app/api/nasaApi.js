const axios = require("axios")
const apiKey = process.env.NASA_API_KEY
const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=`
const logger = require("../logger")

const getPictures = date => {
    return axios
        .get(url + date)
        .then(res => res.data)
        .catch(err => {
            logger.error(
                `---Error loading pic with date: ${date}. Error: ${err.message}`
            )
            return null
        })
}

exports.getPictures = dates => {
    return Promise.all(dates.map(date => getPictures(date))).then(arr =>
        arr.filter(val => val != null)
    )
}
