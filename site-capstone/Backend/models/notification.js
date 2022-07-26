const db = require("../db");
const twilio = require('twilio');
const {TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER} = require("../config")
const { BadRequestError, NotFoundError } = require("../utils/errors");
const schedule = require('node-schedule');

// twilio account API specfic information (keep hidden)
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// sendText function creates a text using twilio function
function sendText(message, phone_number){
    client.messages 
        .create({ 
            // what appears in the text when sent
            body: `${message}`,       
            // twilios number
            from: TWILIO_PHONE_NUMBER,
            // users inputted number need country code to work
            to: `${phone_number}`
            }) 
            // console logs specfic message number to see if sent
        .then(message => console.log(message.sid)) 
        .done();
}

class Notification {

    static async createNotification({notification, medication, user}) {
        // User should submit fields: '"notification time", "dosage"
        const requiredFields = ["notification_time", "dosage"];
        
        // Error if missing required field
        requiredFields.forEach((field) => {
            if (!notification.hasOwnProperty(field)) {
                throw new BadRequestError(`Required field ${field} missing from request body `);
            }
        })

        // Insert medication entry into database
        const results = await db.query(
            `
                INSERT INTO notifications (notification_time, dosage, med_id, user_id)
                VALUES ($1, $2, $3, $4)
                RETURNING   id,
                            notification_time,
                            dosage,
                            med_id,
                            user_id
            `, [notification.notification_time, notification.dosage, medication.id, medication.user_id]
        )

        // Create a new node-schedule job, takes in the time the job is supposed to occur (in cron format)
        // and the function it should call
        // Cron time (minute hour day-of-month month day-of-week)
        const job = schedule.scheduleJob(notification.notification_time, function(){
            const message = `Hello ${user.firstName}! It is time to take ${notification.dosage} pill(s) of ${medication.name}`
            sendText(message, user.phone);
        });
        
        return results.rows[0];  
    }

    // Return array of user owned notifications
    static async listNotificationsForUser({user}) {
        if (!user) {
            throw new BadRequestError("No user provided");
        }

        const results = await db.query(
            `
                SELECT  n.id,
                        n.notification_time,
                        n.dosage,
                        u.phone_number,
                        u.first_name as "user_name"
                FROM notifications AS n
                    JOIN medications AS m ON m.id = n.med_id
                    JOIN users AS u ON u.id = m.user_id
                WHERE m.user_id = $1
                ORDER BY n.notification_time
            `, [user.id]
        )

        return results.rows;
    }

}

module.exports = Notification;