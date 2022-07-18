require("dotenv").config();
require("colors");

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const SECRET_KEY = process.env.SECRET_KEY || "secret_dev_key";

console.log("Medicine Tracker Config:".green);
//console.log("process.env".yellow, Object.keys(process.env));
console.log("App Config".red);
console.log("PORT".blue, PORT);
// console.log("Database URI:".blue, getDatabaseUri());
console.log("---");

module.exports = {
    PORT,
    SECRET_KEY
}