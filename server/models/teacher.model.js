const mongoose = require("mongoose")

const Schema = mongoose.Schema

const teacherSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
    },
    yearOfBirth: {
        type: String,
        required: true,
    },
    gender: {
        type: Boolean,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    mainTeacherOfClass: { type: String },
    teacherOfClass: [{ type: String }],
    subject: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },
})

const Teacher = mongoose.model("Teacher", teacherSchema)

module.exports = Teacher
