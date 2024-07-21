const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const highlightSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },
});

const Highlight = mongoose.model("Highlight", highlightSchema);

module.exports = Highlight;
