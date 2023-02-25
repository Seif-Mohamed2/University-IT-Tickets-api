const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const ticketSchema = new mongoose.Schema({
     user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student'
    }

}, {timestampes: true});

ticketSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
});

ticketSchema.set("timestamps", true);
module.exports = mongoose.model('Ticket', ticketSchema);