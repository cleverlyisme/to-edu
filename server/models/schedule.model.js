const mongoose = require("mongoose")
const Schema = mongoose.Schema

const scheduleSchema = new Schema({
    classRoom: {
        type: String,
        required: true,
    },
    schedule: {
        mon: [{ type: String, _id: false }],
        tue: [{ type: String, _id: false }],
        wed: [{ type: String, _id: false }],
        thu: [{ type: String, _id: false }],
        fri: [{ type: String, _id: false }],
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },
})

const Schedule = mongoose.model("Schedule", scheduleSchema)

module.exports = Schedule
