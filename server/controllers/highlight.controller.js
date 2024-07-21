const Highlight = require("../models/highlight.model")
const { pageSize } = require("../utils/constant")

module.exports.getAllHighlight = async (req, res) => {
    try {
        let totalPage = 1
        const { currentPage, searchString } = req.query
        const hightlights = await Highlight.find({ isDeleted: false })

        let data = [...hightlights].sort((item1, item2) => {
            return new Date(item1.time).getTime() <
                new Date(item2.time).getTime()
                ? 1
                : -1
        })

        if (searchString) {
            data = data.filter((highlight) =>
                highlight.title
                    .toLowerCase()
                    .includes(searchString.toLowerCase())
            )
        }

        if (currentPage > 0) {
            totalPage = Math.ceil(data.length / pageSize) || 1

            data = data.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
            )
        }

        res.status(200).json({ data, totalPage })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getHighlight = async (req, res) => {
    try {
        const { id } = req.params

        const highlight = await Highlight.findOne({
            _id: id,
            isDeleted: false,
        })

        if (!highlight) {
            throw new Error("Không có thông báo")
        }

        res.status(200).json(highlight)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.deleteHighlight = async (req, res) => {
    try {
        const { id } = req.params

        const highlight = await Highlight.findOne({
            _id: id,
            isDeleted: false,
        })

        if (!highlight) {
            throw new Error("Thông báo không tồn tại")
        }

        highlight.isDeleted = true
        await highlight.save()

        res.status(200).send(true)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.createOrUpdateHighlight = async (req, res) => {
    try {
        const data = req.body
        const { id, title, content } = data

        const time = new Date()

        if (id) {
            highlight = await Highlight.findOne({ _id: id, isDeleted: false })
            if (!highlight) throw new Error("Thông báo không tồn tại")

            highlight.title = title
            highlight.content = content
            highlight.time = time
            await highlight.save()
            return res.status(200).send(true)
        }

        data.time = time
        data.isDeleted = false
        const newHighlight = new Highlight(data)
        await newHighlight.save()

        res.status(201).send(true)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getLastestHighlight = async (req, res) => {
    try {
        const hightlights = await Highlight.find({ isDeleted: false })

        let data = [...hightlights].sort((item1, item2) => {
            return new Date(item1.time).getTime() <
                new Date(item2.time).getTime()
                ? 1
                : -1
        })

        data = data.slice(0, 10)
        res.status(200).json(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
}
