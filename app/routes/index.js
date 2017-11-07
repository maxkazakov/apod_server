const nasaApi = require("../api/nasaApi")
const logger = require("../logger")
const moment = require("moment")
const database = require("../db")
const errors = require("../errors")

module.exports = function(app, db) {
    app.get("/pictures/:date", (req, res, next) => {
        const date = req.params.date
        logger.info(`---Start pics requiest. Date: ${date}. Porsion size: ${portionSize}`)
        const dates = makeDates(date) // strings

        database
            // try load from db
            .tryGetPictures(db, dates)
            .then(pics => {
                logger.info("Pics loaded from db")
                res.json(pics)
            })
            .catch(err => {
                logger.info("Pics missed in db.")
                nasaApi
                    .getPictures(dates)
                    .then(data => {
                        return database.savePictures(db, data)
                    })
                    .then(data => {
                        logger.info("---Finish. Pics successfully loaded")
                        res.send(data)
                    })
                    .catch(next)
            })
    })

    app.use(function(err, req, res, next) {
        logger.error("---Finish. Error while loading: " + err.message)
        console.log(err)
        res.status(err.code || 500).send(err.message)
    })
}

const portionSize = 10

const makeDates = date_str => {
    const date = moment(date_str)
    if (!date.isValid()) throw new errors.ParseDateError(date_str)

    var dates = []
    for (var i = 0; i < portionSize; i++) {
        dates.push(date.clone().subtract(i, "days"))
    }
    return dates.map(date => date.format("YYYY-MM-DD"))
}
