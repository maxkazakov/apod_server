const collectionName = "pictures"

exports.tryGetPictures = (db, dates) => {
    const collection = db.collection(collectionName)
    return collection
        .find({})
        .toArray()
        .then(pictures => {
            const result = pictures.filter(pic => dates.includes(pic.date))
            if (result.length != dates.length) throw new Error(`Bad find operation.`)
            return result
        })
}

exports.savePictures = (db, pictures) => {
    const collection = db.collection(collectionName)
    return collection.insertMany(pictures).then(res => {
        if (res.insertedCount != pictures.length) {
            throw new Error(`Bad insert operation. Inserted count: ${res.insertedCount}. Expected count: ${pictures.length()}`)
        }
        return pictures
    })
}
