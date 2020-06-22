const express = require('express');
const morgan = require('morgan');
// var cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

 
const app = express();
// app.use(cors('*'))
const teamRoutes = require('./api/routes/teams');
const matchRoutes = require('./api/routes/matches');
const userRoutes = require('./api/routes/users');


mongoose.connect('mongodb+srv://user:' + process.env.MONGO_ATLAS_PW +
    '@cluster0-yro4p.mongodb.net/<dbname>?retryWrites=true&w=majority');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers',
        "Origin,X-Requested-with, Content-Type,Accept,Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE')
        return res.status(200).json({});
    }
    next();
});
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/users', userRoutes);


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;