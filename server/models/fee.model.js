const mongoose = require("mongoose");

const Semester = require("./semester.model");

const Schema = mongoose.Schema;

const feeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  grade: {
    type: Number,
    required: true,
  },
  classRoom: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  from: {
    type: Date,
    required: true,
    default: new Date().toISOString(),
  },
  to: {
    type: Date,
    required: true,
    default: new Date().toISOString(),
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Fee = mongoose.model("Fee", feeSchema);

module.exports = Fee;
