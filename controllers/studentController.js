const Student = require("../models/Student");
const Ticket = require("../models/Ticket");
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const { json } = require("express");
const User = require("../models/User")

const getAllStudents = asyncHandler(async (req, res) => {
    const students = await Student.find().select("-password").lean();
    if (!students?.length){
        return res.status(400).json({message: "No students found"});
    } else {
        return res.json(students);
    }
});

const createNewStudent = asyncHandler(async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password){
        return res.status(400).json({message: "All fields are required"});
    }

    const Duplicate = await Student.findOne({username}).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (Duplicate){
        return res.status(409).json({message: "Duplicate student is found"});
    }
    const DuplicateUser = await User.findOne({username}).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (DuplicateUser){
        return res.status(409).json({message: "Duplicate user is found"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    newStudentObject = {username, "password": hashedPassword};
    const newStudent = await Student.create(newStudentObject);
    if (newStudent){
        return res.status(201).json({message: `Student ${username} is created`});
    } else {
        return res.status(400).json({message: "Student couldn't be created"});
    }

});

const updateStudent = asyncHandler(async (req, res) => {
    const {id, username, password, active, ticketsNo} = req.body;
    if (!id || !username || typeof active !== 'boolean'){
        return res.status(400).json({message: "All fields are required"});
    }

    const student = await Student.findById(id).exec();
    if (!student){
        return res.status(400).json({message: "User with this id was not found"});
    }

    const duplicate = await Student.findOne({username}).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message: "There is another student with the same username"});
    }
    const DuplicateUser = await User.findOne({username}).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (DuplicateUser){
        return res.status(409).json({message: "Duplicate user is found"});
    }

    student.username = username;
    student.active = active;
    if (ticketsNo){
        student.ticketsNo = ticketsNo;
    }
    if (password){
        const hashedPassword = await bcrypt.hash(password, 10);
        student.password = hashedPassword;
    }

    const studentSaved = await student.save();
    return res.status(200).json({message: "User has been updated"});
});

const delelteStudent = asyncHandler(async (req, res) => {
    const {id} = req.body;
    if (!id){
        return res.status(400).json({message: "The id is required"});
    }
    const ticket = await Ticket.findOne({student: id}).lean().exec();
    if (ticket){
        return res.status(400).json({message: "The student has tickets assigned"});
    }

    const student = await Student.findById(id).exec();

    if (!student){
        return res.status.json({message: "This student is not found"});
    }

    const deletedStudent = await student.deleteOne();
    return res.status(200).json({message: "The student is deleted"});

});

module.exports = {
    getAllStudents,
    createNewStudent,
    updateStudent,
    delelteStudent
}
