const express = require("express");
const User = require("../models/user");
const { createUserJwt } = require("../utils/tokens");
const security = require("../middleware/security");
const router = express.Router();

router.post("/login", async (req, res, next) => {
    try {
        const user = await User.login(req.body);
        const token = createUserJwt(user);
        return res.status(200).json({token, user});
    }catch(err) {
        next(err);
    }
})

router.post("/register", async (req, res, next) => {
    try {
        const user = await User.register(req.body);
        const token = createUserJwt(user);
        return res.status(201).json({token, user});
    }catch(err) {
        next(err);
    }
})

// Get's user information and returns it
router.get("/me", security.requireAuthenticatedUser, async (req,res,next) => {
    try {
        const {email} = res.locals.user;
        const user = await User.fetchUserByEmail(email);
        const publicUser = await User.makePublicUser(user);
        return res.status(200).json({ user: publicUser})
    } catch(err) {
        next(err);
    }
})

module.exports = router;