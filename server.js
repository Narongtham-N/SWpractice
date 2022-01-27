const express = require('express');
const dotenv = require('dotenv');

//route file
const hospitals = require('./routes/hospitals');

//load env vars
dotenv.config({path:'./config/config.env'});

const app = express();


app.use('/api/v1/hospitals', hospitals)

const PORT = process.env.PORT;
app.listen(PORT, console.log('Server is running in', process.env.NODE_ENV,'mode on port', PORT));