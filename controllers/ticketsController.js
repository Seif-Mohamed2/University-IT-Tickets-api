const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Student = require("../models/Student")
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const { json } = require('express');

const getAllTickets = asyncHandler (async (req, res) => {
    const tickets = await Ticket.find().lean();
    if (!tickets?.length){
        return res.status(400).json({message: 'No tickets found'});
    }
    const newTickets = [];
    for (const ticket0 of tickets){
        const userName = await User.findById(ticket0.user).lean().exec();
        const student0 = await Student.findById(ticket0.student).lean().exec();
        newTickets.push({...ticket0, username: userName.username, studentusername: student0.username});
    }
    return res.json(newTickets);
    
});

const createNewTicket = asyncHandler (async (req, res) => {
    const {user, title, text, student} = req.body;
    if (!user || !title || !text || !student){
        return res.status(400).json({message: "All fields are required"});
    }
    const userExist = await User.findById(user).lean().exec();
    if (!userExist){
        return res.status(400).json({message: "User not found"});
    }

    const studentExist = await Student.findById(student).lean().exec();
    if (!studentExist){
        return res.status(400).json({message: "Student not found"});
    }


    const duplicate = await Ticket.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()
    if (duplicate){
        return res.status(409).json({message: "duplicate title"});
    }
    const ticketObject = {user, title, text, student};
    const newTicket = await Ticket.create(ticketObject);

    if (newTicket){
        return res.status(201).json({message: `New ticket ${title} created`});
    }
    else {
        return res.status(400).json({message : 'Invalid ticket data recieved'});
    }

});
const updateTicket = asyncHandler (async (req, res) => {
    const {id, user, title, text, completed, student} = req.body;
    if (!id || !user || !title || !text || typeof completed !== 'boolean' || !student){
        res.status(400).json({message: "All fields are required"});
    }
    const ticket = await Ticket.findById(id).exec();
    if (!ticket){
        res.status(400).json({message: "Ticket not found"});
    }
    const duplicate = await Ticket.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()
    if (duplicate && duplicate?._id.toString() !== id){
        res.status(409).json({message: "duplicate ticket title"});
    }

    ticket.user = user;
    ticket.text = text;
    ticket.title = title;
    ticket.completed = completed;
    ticket.student = student;
    const updatedTicket = await ticket.save();
    res.status(200).json({message: `${title} ticket was updated`});

});
const deleteTicket = asyncHandler (async (req, res) => {
    const {id} = req.body;
    if (!id){
        res.status(400).json({message: "Id is required"});
    }

    const ticket = await Ticket.findById(id).exec();
    if (!ticket){
        res.status(400).json({message: "Ticket not found"});
    }

    const deletedTicket = await ticket.deleteOne();
    const reply = `Ticket ${deletedTicket.title} is deleted`;

    return res.json(reply);
});


module.exports = {
    getAllTickets,
    createNewTicket,
    updateTicket,
    deleteTicket
};