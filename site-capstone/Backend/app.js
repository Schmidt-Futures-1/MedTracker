const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require("./routes/auth");
const security = require("./middleware/security");
const medicationRoutes = require("./routes/medication")
const notificationRoutes = require("./routes/notification")
const { NotFoundError} = require("./utils/errors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// Security middleware
app.use(security.extractUserFromJwt);

// Routes
app.use("/auth", authRoutes);
app.use("/medication", medicationRoutes);
app.use("/notification", notificationRoutes);

// Health endpoint
app.get("/",  (req, res, next) => {
    res.status(200).json({ping: "pong"})
})

// Not Found errror handler
app.use((req, res, next) => {
    return next(new NotFoundError());
})

// Generic Error Handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message;
    
    return res.status(status).json({
        error: {message, status}
    })
})

module.exports = app;