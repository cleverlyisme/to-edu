const mongoose = require("mongoose")

const Schema = mongoose.Schema

const dayoffSchema = new Schema({
    day: {
        type: String,
    },
    student: {
        id: { type: String },
        name: { type: String },
        classRoom: { type: String },
        permission: { type: Boolean },
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },
})

const Dayoff = mongoose.model("Dayoff", dayoffSchema)

module.exports = Dayoff
