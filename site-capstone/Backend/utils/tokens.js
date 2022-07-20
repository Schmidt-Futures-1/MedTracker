const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../config");

const generateToken = (data) => jwt.sign(data, SECRET_KEY, {expiresIn: "12h"});

const createUserJwt = (user) => {
    console.log("create user jwt");
    const payload = {
        email: user.email,
        user: user.username
    }
    return generateToken(payload);
}

const validateToken = (token) => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    }catch(err) {
        return {}
    }
}

module.exports = {
    generateToken,
    validateToken,
    createUserJwt
}