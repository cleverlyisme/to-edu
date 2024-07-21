const { getAccess } = require("../validateUpdate")

module.exports.getUpdateStatus = (req, res) => {
    res.status(200).send(getAccess())
}
