const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

//route file
const hospitals = require('./routes/hospitals');
const auth =require('./routes/auth');
const appointments = require('./routes/appointments');

//load env vars
dotenv.config({path:'./config/config.env'});

//connect to database
connectDB();

const app = express();

//body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

app.use('/api/v1/hospitals', hospitals);
app.use('/api/v1/auth', auth);
app.use('/api/v1/appointments', appointments);

const PORT = process.env.PORT;

const server = app.listen(PORT, console.log('Server is running in', process.env.NODE_ENV,'mode on port', PORT));

//Handle unhandled promise rejections
process.on('unhandledRejection', (err,promise) => {
    console.log(`Error: ${err.message}`);

    //close server and exit process
    server.close(() => {process.exit(1)});
})