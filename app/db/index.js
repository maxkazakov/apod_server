const collectionName = "pictures"

const getPicture = (collection, date) => {
    return collection.findOne({ date: date }).then(res => (res ? res : date))
}

exports.getPicturesFromDb = (db, dates) => {
    const collection = db.collection(collectionName)
    return Promise.all(
        dates.map(date => getPicture(collection, date))
    ).then(res => {
        const result = res.reduce(
            (acc, val) => {
                if (typeof val == "string") {
                    acc.missedDates.push(val)
                } else {
                    acc.pictures.push(val)
                }
                return acc
            },
            { pictures: [], missedDates: [] }
        )
        return result
    })
}

exports.savePicturesToDb = (db, pictures) => {
    const collection = db.collection(collectionName)
    return collection.insertMany(pictures).then(res => {
        if (res.insertedCount != pictures.length) {
            throw new Error(
                `Bad insert operation. Inserted count: ${res.insertedCount}. Expected count: ${pictures.length()}`
            )
        }
        return pictures
    })
}
