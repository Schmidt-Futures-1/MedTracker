const express = require("express");
const User = require("../models/user");
const Medication = require("../models/medication");
const security = require("../middleware/security");
const permissions = require("../middleware/permissions");
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
        const {email} = res.locals.user;
        const user = await User.fetchUserByEmail(email);
        const publicUser = await User.makePublicUser(user);
        const allEntries = await Medication.listMedicationForUser({user:publicUser});
        return res.status(200).json({medications: allEntries});
    } catch(err) {
        next(err);
    }
})

// Get medication based on medication id
router.get("/:medicationId", security.requireAuthenticatedUser, permissions.authedUserOwnsMedication, async (req, res, next) => {
    try {
        // Can get the medication info from locals because we already fetched and put the info in the authedUserOwnsMedication middleware in permissions
        const medicationEntry = res.locals.medication;
        return res.status(200).json({medication: medicationEntry});
    }catch(err) {
        next(err);
    }
})

// Edit medication entry
router.put("/:medicationId", security.requireAuthenticatedUser, permissions.authedUserOwnsMedication, async (req, res, next) => {
    try {
        const {medicationId} = req.params;
        const medication = await Medication.editMedication({ medicationUpdate: req.body, medicationId });
        return res.status(200).json({ medication });
    } catch (err) {
        next(err)
    }
})

// Delete a medication entry by id
router.delete("/:medicationId", security.requireAuthenticatedUser, permissions.authedUserOwnsMedication, async (req, res, next) => {
    try {
        const {medicationId} = req.params;
        const deletedMedication = await Medication.deleteMedication({ medicationId });
        return res.status(200).json({ code: 200, message: "Medication deleted", deletedMedication});
    } catch (err) {
        next(err);
    }
})

// Refill medication by id
router.put("/refill/:medicationId", security.requireAuthenticatedUser, permissions.authedUserOwnsMedication, async (req, res, next) => {
    try {
        const {medicationId} = req.params;
        const medication = await Medication.refillMedication({ refillAmount: req.body.refillAmount, medicationId });
        return res.status(200).json({ medication });
    } catch (err) {
        next(err)
    }
})

module.exports = router;