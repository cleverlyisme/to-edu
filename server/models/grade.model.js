const mongoose = require('mongoose')

const Schema = mongoose.Schema

const gradeSchema = new Schema({
    grade: {
        type: Number,
        required: true,
        unique: true
    },
    classRoom: [
        { type: String, _id: false }
    ],
    isDeleted: {
        type: Boolean,
        required: true
    }
});

const Grade = mongoose.model('Grade', gradeSchema)

module.exports = Grade