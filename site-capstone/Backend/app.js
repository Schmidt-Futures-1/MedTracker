const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require("./routes/auth");
const security = require("./middleware/security");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// Security middleware
app.use(security.extractUserFromJwt);

// Routes
app.use("/auth", authRoutes);

// Health endpoint
app.get("/",  (req, res, next) => {
    res.status(200).json({ping: "pong"})
})

module.exports = app;