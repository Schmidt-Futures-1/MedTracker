const express = require("express");
const User = require("../models/user");
const Medication = require("../models/medication");
const security = require("../middleware/security");
const router = express.Router();

// Create a new medication entry
router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const {user} = res.locals;
        const medication = await Medication.createMedication({ user, medication: req.body});
        return res.status(201).json({medication});
    }catch(err) {
        next(err);
    }
})

// Get all user owned medication entries
router.get("/", security.requireAuthenticatedUser, async (req,res,next) => {
    try {
        console.log("user", res.locals.user)
        const {email} = res.locals.user;
        const user = await User.fetchUserByEmail(email);
        const publicUser = await User.makePublicUser(user);
        const allEntries = await Medication.listMedicationForUser({user:publicUser});
        return res.status(200).json({medications: allEntries});
    } catch(err) {
        next(err);
    }
})



module.exports = router;