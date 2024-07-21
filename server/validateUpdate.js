let canModify = true

module.exports.getAccess = () => canModify

module.exports.setAccess = (status) => (canModify = status)
