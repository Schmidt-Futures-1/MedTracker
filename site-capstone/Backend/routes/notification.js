const express = require("express");
const User = require("../models/user");
const Notification = require("../models/notification");
const security = require("../middleware/security");
const permissions = require("../middleware/permissions");
const router = express.Router();

// Get all user owned notification entries
router.get("/", security.requireAuthenticatedUser, async (req,res,next) => {
    try {
        const {email} = res.locals.user;
        const user = await User.fetchUserByEmail(email);
        const publicUser = await User.makePublicUser(user);
        const allEntries = await Notification.listNotificationsForUser({user:publicUser});
        return res.status(200).json({notifications: allEntries});
    } catch(err) {
        next(err);
    }
})

// Create a new notification entry
router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const {email} = res.locals.user;
        const user = await User.fetchUserByEmail(email);
        const publicUser = await User.makePublicUser(user);
        const {notification, medication} = req.body;
        const newNotification = await Notification.createNotification({ notification, medication, user:publicUser});
        return res.status(201).json({newNotification});
    }catch(err) {
        next(err);
    }
})

// Get notification based on notification id
router.get("/:notificationId", security.requireAuthenticatedUser, permissions.authedUserOwnsNotification, async (req, res, next) => {
    try {
        const notificationEntry = res.locals.notification;
        return res.status(200).json({notification: notificationEntry});
    }catch(err) {
        next(err);
    }
})

module.exports = router;