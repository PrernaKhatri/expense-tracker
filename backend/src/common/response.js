exports.success = (res, message, data=null) => {
    res.status(200).json({ success : true, message, data })
}

exports.created = (res, message, data=null) => {
    res.status(201).json({ success : true, message, data })
}

exports.error = (res, statusCode, message) => {
    res.status(statusCode).json({ success : false, message})
}