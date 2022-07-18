const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// Health endpoint
app.get("/",  (req, res, next) => {
    res.status(200).json({ping: "pong"})
})

module.exports = app;