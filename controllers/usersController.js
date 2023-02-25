const User = require('../models/User');
const Ticket = require('../models/Ticket');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const Student = require('../models/Student');

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    if (!users?.length){
        return res.status(400).json({message: 'No users found'});
    }
    else {
        return res.json(users);
    }
});

const createNewUser = asyncHandler(async (req, res) => {
    const {username, password, roles} = req.body;
    if (!username || !password){
        return res.status(400).json({message: 'all fields are required'});
    }
    const duplicate = await User.findOne({username}).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate){
        return res.status(409).json({message: 'Duplicate User'});
    }
    const duplicateStudent = await Student.findOne({username}).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicateStudent){
        return res.status(409).json({message: 'Duplicate Student'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let userObject;
    if (!Array.isArray(roles) || !roles.length){
        userObject = {username, "password": hashedPassword};
    } else {
        userObject = {username, "password": hashedPassword, roles};
    }


    const newUser = await User.create(userObject);
    if (newUser){
        return res.status(201).json({message: `New user ${username} created`});
    }
    else {
        return res.status(400).json({message : 'Invalid user data recieved'});
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const {id, username, roles, active, password, ticketsNo} = req.body;
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean'){
        return res.status(400).json({message: 'all fields are required'});
    }

    const user = await User.findById(id).exec();
    if (!user){
        return res.status(400).json({message: 'user not found'});
    }

    const duplicate = await User.findOne({username}).collation({ locale: 'en', strength: 2 }).lean().exec();

    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message: 'Duplicate User'});
    }
    const duplicateStudent = await Student.findOne({username}).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicateStudent){
        return res.status(409).json({message: 'Duplicate Student'});
    }

    user.username = username;
    user.roles = roles;
    user.active = active;
    if (ticketsNo){
        user.ticketsNo = ticketsNo;
    }
    if (password){
        user.password = await bcrypt.hash(password, 10);
    }

    const saveUser = await user.save();
    return res.status(200).json({message: `${saveUser.username} updated`});
});

const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.body;
    if (!id ){
        return res.status(400).json({message: 'User ID required'});
    }

    const ticket = await Ticket.findOne({user: id}).lean().exec();
    if (ticket){
        return res.status(400).json({message : 'User has assigned Tickets'})
    }
    const user = await User.findById(id).exec();

    if (!user){
        res.status(400).json({message: 'User not found'});
    }

    const deletedUser = await user.deleteOne();
    return res.status(200).json({message: `${deletedUser.username} is deleted`});
});

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
};
