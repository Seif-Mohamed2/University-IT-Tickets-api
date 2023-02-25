require('dotenv').config();
const express = require('express');
const { builtinModules } = require('module');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;
const {logger , logEvents} = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

console.log(process.env.NODE_ENV);
connectDB();
app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/", require('./routes/root'));

app.use('/users', require('./routes/userRoutes'));

app.use('/tickets', require('./routes/ticketRoutes'));

app.use('/students', require('./routes/studentRoutes'));

app.use("/auth", require("./routes/authRoutes"));

app.use('/', express.static(path.join(__dirname, 'public')));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views' , '404.html'));
    }
    else if (req.accepts('json')){
        res.json({message: '404 not found'});
    }
    else {
        res.type('txt').send('404 not found');
    }
})

app.use(errorHandler);
mongoose.connection.once('open', () => {
    console.log("connected to mongodb");
    app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
});

mongoose.connection.on('error', () => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
})


