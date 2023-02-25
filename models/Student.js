const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    ticketsNo: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Student', studentSchema);