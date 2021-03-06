const nasaApi = require("../api/nasaApi")
const logger = require("../logger")
const moment = require("moment")
const database = require("../db")
const errors = require("../errors")

module.exports = function(app, db) {
    app.get("/pictures", (req, res, next) => {
        let dates = req.query.dates
        if (dates && !(dates instanceof Array)) dates = [dates]

        logger.info(`---Dates: ${dates}`)
        if (!dates || dates.length == 0) {
            const date = req.query.date
            const portionSize = parseInt(req.query.portionSize) || 10
            dates = makeDates(date, portionSize) // strings
        }

        logger.info(`---Start pics requiest. Dates: ${dates}`)

        database.getPicturesFromDb(db, dates).then(result => {
            if (result.missedDates.length == 0) {
                logger.info("Pics loaded from db")
                res.json(result.pictures)
            } else {
                nasaApi
                    .getPictures(result.missedDates)
                    .then(missedPictures => {
                        logger.info(
                            `Pics missed in db. Count missed: ${
                                missedPictures.length
                            }`
                        )
                        return database.savePicturesToDb(db, missedPictures)
                    })
                    .then(missedPictures => {
                        logger.info("---Finish. Pics successfully loaded")
                        res.send(result.pictures.concat(missedPictures))
                    })
                    .catch(next)
            }
        })
    })

    app.use(function(err, req, res, next) {
        logger.error("---Finish. Error while loading: " + err.message)
        res.status(err.code || 500)
        res.json({ error: err.message })
    })
}

const makeDates = (date_str, portionSize) => {
    if (!date_str) {
        throw new errors.ParseDateError(date_str)
    }
    const date = moment(date_str)
    if (!date.isValid()) throw new errors.ParseDateError(date_str)

    var dates = []
    for (var i = 0; i < portionSize; i++) {
        dates.push(date.clone().subtract(i, "days"))
    }
    return dates.map(date => date.format("YYYY-MM-DD"))
}
