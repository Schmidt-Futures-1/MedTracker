const Medication = require("../models/medication");
const Notification = require("../models/notification");
const { ForbiddenError } = require("../utils/errors");
const User = require("../models/user");

const authedUserOwnsMedication = async (req, res, next) => {
    try {
        const {email} = res.locals.user;
        const {medicationId} = req.params;
        const user = await User.fetchUserByEmail(email);
        const publicUser = await User.makePublicUser(user);
        const medication = await Medication.fetchMedicationById({user:publicUser, medicationId});

        if (medication.user_email !== user.email) {
            throw new ForbiddenError("User is not allowed to access other user's medication information");
        }

        res.locals.medication = medication;

        return next();

    }catch(err) {
        return next(err);
    }
}

const authedUserOwnsNotification = async (req, res, next) => {
    try {
        const {email} = res.locals.user;
        const {notificationId} = req.params;
        const user = await User.fetchUserByEmail(email);
        const publicUser = await User.makePublicUser(user);
        const notification = await Notification.fetchNotificationById({user:publicUser, notificationId});

        if (notification.user_email !== user.email) {
            throw new ForbiddenError("User is not allowed to access other user's notification information");
        }

        res.locals.notification = notification;

        return next();

    }catch(err) {
        return next(err);
    }
}

module.exports = {
    authedUserOwnsMedication,
    authedUserOwnsNotification
}