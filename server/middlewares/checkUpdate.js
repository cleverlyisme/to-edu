const { getAccess } = require("../validateUpdate")

module.exports = (req, res, next) => {
    if (getAccess()) {
        next()
    } else {
        res.status(500).send("Hệ thống đang cập nhật")
    }
}
