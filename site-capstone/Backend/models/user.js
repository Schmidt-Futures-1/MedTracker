const db = require("../db");
const bcrypt = require("bcrypt");
const {BCRYPT_WORK_FACTOR} = require("../config");
const {UnauthorizedError, BadRequestError} = require("../utils/errors");

class User {
    //////// Returns user info safe for public view (does not show confidential info like passwords)
    static async makePublicUser(user) {
        return {
            id:user.id,
            email:user.email,
            firstName:user.first_name,
            lastName:user.last_name,
            created_at:user.created_at
        }
    }


    //////// Fetches a user by their email and returns their user info
    static async fetchUserByEmail(email) {
        // Make sure that an email was passed in
        if (!email) {
            throw new BadRequestError("No email provided");
        }

        const query = `SELECT * FROM users WHERE email = $1`;

        const result = await db.query(query, [email.toLowerCase()]);

        // Choose first user that was returned, there should only be 1 anyways
        const user = result.rows[0];

        return user;
    }


    //////// Takes in email and password as arguments and checks if they are a valid user
    //////// Returns PublicUser info
    static async login(credentials) {
        // User should submit email and password
        const requiredFields = ["email", "password"];
        // Error: if any fields are missing
        requiredFields.forEach(field => {
            if(!credentials.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body`);
            }
        })

        // Look up user in database by email
        const user = await User.fetchUserByEmail(credentials.email);
        // If user found, compare submitted password with password in database
        if (user) {
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (isValid) {
                return User.makePublicUser(user);
            }
        }
        
        // If match, return user
        // Error: if anything goes wrong
        throw new UnauthorizedError("Invalid email/password combo")
    }


    //////// Takes in user's email, password, firstName and lastName
    //////// Registers user and then inserts their user info into database 
    static async register(credentials) {
        console.log("Registering User");
        // User should submit email, password
        const requiredFields = ["email", "password", "firstName", "lastName"];

        // Error: if any fields are missing
        requiredFields.forEach(field => {
            if(!credentials.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body`);
            }
        })

        // Error check the first name
        if (credentials.firstName === "") {
            throw new BadRequestError("Invalid first name.");
        }

        // Error check the last name
        if (credentials.lastName === "") {
            throw new BadRequestError("Invalid last name.");
        }

        // Error check the email
        if (credentials.email.indexOf("@") <= 0) {
            throw new BadRequestError("Invalid email.");
        }
        
        // Error check the password
        if (credentials.password === "") {
            throw new BadRequestError("Invalid password.");
        }


        // Error: if user with same email already exists
        const existingUser = await User.fetchUserByEmail(credentials.email);
        if (existingUser) {
            throw new BadRequestError(`Duplicate email: ${credentials.email}`);
        }       

        // Take user password and hash it
        const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR)


        // Take user email and lowercase it
        const lowerCasedEmail = credentials.email.toLowerCase();

        const result = await db.query(`
            INSERT INTO users (
                email,
                first_name,
                last_name,
                password
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, first_name, last_name, password, created_at;
        `, [lowerCasedEmail, credentials.firstName, credentials.lastName, hashedPassword])

        // Return user
        const user = result.rows[0];

        return User.makePublicUser(user);
    }

}

module.exports = User;