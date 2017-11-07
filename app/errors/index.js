function ParseDateError(dateStr) {
    Error.call(this, dateStr)
    this.name = "ParseDateError"
    this.message = "Cannot parse date: " + dateStr
    this.code = 400
}

ParseDateError.prototype = Object.create(Error.prototype)

exports.ParseDateError = ParseDateError
