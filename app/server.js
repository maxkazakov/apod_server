const express = require("express")
const MongoClient = require("mongodb").MongoClient
const bodyParser = require("body-parser")
const app = express()

const port = 8000
const config = require("./config")

MongoClient.connect(config.dbUrl, (err, database) => {
    if (err) return console.log(err)
    // routes
    require("./routes")(app, database)
    app.listen(port, () => {
        console.log("We are live on " + port)
    })
})
