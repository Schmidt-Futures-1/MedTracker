const express = require("express");
const User = require("../models/user");
const Medication = require("../models/medication");
const security = require("../middleware/security");
const router = express.Router();

// Create a new nutrition entry
router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const medication = await Medication.createMedication({ medication: req.body});
        return res.status(201).json({medication});
    }catch(err) {
        next(err);
    }
})

// Get all user owned nutrition entries
// router.get("/", security.requireAuthenticatedUser, async (req,res,next) => {
//     try {
//         const {email} = res.locals.user;
//         const user = await User.fetchUserByEmail(email);
//         const publicUser = await User.makePublicUser(user);
//         //const allEntries = await Nutrition.listNutritionForUser({user:publicUser});
//         return res.status(200).json({nutritions: allEntries});
//     } catch(err) {
//         next(err);
//     }
// })

module.exports = router;