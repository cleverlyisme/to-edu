const jwt = require("jsonwebtoken")

module.exports.authAdmin = (req, res, next) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : ""

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        const userInfo = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET_KEY)

        if (userInfo.role !== "admin") {
            throw new Error("Từ chối quyền truy cập")
        }

        req.id = userInfo._id
        next()
    } catch (err) {
        res.status(401).send(err.message)
    }
}

module.exports.authTeacher = (req, res, next) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : ""

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        const userInfo = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        if (userInfo.role !== "teacher") {
            throw new Error("Từ chối quyền truy cập")
        }

        req.id = userInfo._id

        next()
    } catch (err) {
        res.status(401).send(err.message)
    }
}

module.exports.authAdminTeacher = (req, res, next) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : ""

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        const userInfo = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        if (userInfo.role !== "admin" && userInfo.role !== "teacher") {
            throw new Error("Từ chối quyền truy cập")
        }
        next()
    } catch (err) {
        res.status(401).send(err.message)
    }
}

module.exports.authTeacherStudent = (req, res, next) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : ""

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        const userInfo = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        if (userInfo.role !== "teacher" && userInfo.role !== "parent") {
            throw new Error("Từ chối quyền truy cập")
        }

        req.role = userInfo.role
        req.id = userInfo._id

        next()
    } catch (err) {
        res.status(401).send(err.message)
    }
}

module.exports.authUser = (req, res, next) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : ""

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        const userInfo = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET_KEY)

        if (
            userInfo.role !== "admin" &&
            userInfo.role !== "teacher" &&
            userInfo.role !== "parent"
        ) {
            throw new Error("Từ chối quyền truy cập")
        }

        req.userInfo = userInfo
        next()
    } catch (err) {
        res.status(401).send(err.message)
    }
}
