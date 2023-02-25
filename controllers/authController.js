const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');


const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    console.log("")
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    console.log(username)
    console.log(password)
    const foundStudent = await Student.findOne({username}).exec();
    const foundUser = await User.findOne({ username }).exec();

    if ((!foundUser || !foundUser?.active) && (!foundStudent || !foundStudent?.active)) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    let isStudent = false;
    if (foundStudent){
        console.log("found S")
        isStudent = true;
    }
    let match;
    if (!isStudent){
        match = await bcrypt.compare(password, foundUser.password)
    } else {
        match = await bcrypt.compare(password, foundStudent.password)
    }
    if (!match) return res.status(401).json({ message: 'Incorrect Password' })
    let userInfo;
    if (!isStudent){
        userInfo = {username, roles: foundUser.roles, isStudent: false}
    } else {
        userInfo = {username, roles: [], isStudent: true}
    }


    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": userInfo.username,
                "roles": userInfo.roles,
                "isStudent": userInfo.isStudent
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "username": userInfo.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: 'None', //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles
    res.json({ accessToken })
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()
            const foundStudent = await Student.findOne({ username: decoded.username }).exec()
            if (!foundUser && !foundStudent) return res.status(401).json({ message: 'Unauthorized' })
            let isStudent;
            if (foundStudent){
                isStudent = true;
            } else {
                isStudent = false;
            }
            let userInfo
            if (!isStudent){
                userInfo = {username: foundUser.username, roles: foundUser.roles, isStudent: false}
            } else {
                userInfo = {username: foundStudent.username, roles: [], isStudent: true}
            }

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": userInfo.username,
                        "roles": userInfo.roles,
                        "isStudent": userInfo.isStudent
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}
