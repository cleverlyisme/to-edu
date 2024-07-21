module.exports = date => {
    const toDate = new Date(date)
    return toDate.getTime() === toDate.getTime()
}