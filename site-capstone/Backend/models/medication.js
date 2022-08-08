const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Medication {

    static async createMedication({user, medication}) {
        // User should submit fields: '"name", "strength", "units", "rxcui", "current_pill_count", "total_pill_count", "frequency"
        const requiredFields = ["name", "strength", "units", "rxcui", "current_pill_count", "total_pill_count", "frequency"];
        
        // Error if missing required field
        requiredFields.forEach((field) => {
            if (!medication.hasOwnProperty(field)) {
                throw new BadRequestError(`Required field ${field} missing from request body `);
            }
        })

        // Insert medication entry into database
        const results = await db.query(
            `
                INSERT INTO medications (name, strength, units, frequency, rxcui, current_pill_count, total_pill_count, user_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, (SELECT id FROM users WHERE email=$8))
                RETURNING   id,
                            name,
                            rxcui,
                            strength,
                            units,
                            frequency,
                            current_pill_count,
                            total_pill_count,
                            user_id
            `, [medication.name, medication.strength, medication.units, medication.frequency, medication.rxcui, medication.current_pill_count, medication.total_pill_count, user.email]
        )
        
        return results.rows[0];  
    }
    
    static async listMedicationForUser({user}) {
        if (!user) {
            throw new BadRequestError("No user provided");
        }

        const results = await db.query(
            `
                SELECT  m.id,
                        m.name,
                        m.rxcui,
                        m.strength,
                        m.units,
                        m.frequency,
                        m.current_pill_count,
                        m.total_pill_count,
                        u.email as "user_email"
                FROM medications AS m
                    JOIN users AS u ON u.id = m.user_id
                WHERE m.user_id = $1
                ORDER BY m.name ASC
            `, [user.id]
        )

        return results.rows;
    }

    static async fetchMedicationById({user, medicationId}) {
        if (!user) {
            throw new BadRequestError("No user provided");
        }

        const results = await db.query(
            `
                SELECT  m.id,
                        m.name,
                        m.rxcui,
                        m.strength,
                        m.units,
                        m.frequency,
                        m.current_pill_count,
                        m.total_pill_count,
                        n.id AS "notification_id",
                        n.notification_time,
                        n.dosage,
                        n.timezone,
                        n.non_converted_time,
                        u.email as "user_email"
                FROM medications AS m
                    JOIN users AS u ON u.id = m.user_id
                    LEFT JOIN notifications AS n ON m.id = n.med_id
                WHERE m.id=$1
            `, [medicationId]
        )

        const medication = results.rows[0];

        if (!medication) {
            throw new NotFoundError()
        }

        return medication;
    }

    static async editMedication({ medicationUpdate, medicationId }) {
        // User should submit fields: '"name", "strength", "units", "rxcui", "current_pill_count", "total_pill_count", "frequency"
        const requiredFields = ["name", "strength", "units", "rxcui", "current_pill_count", "total_pill_count", "frequency"];
        
        // Error if missing required field
        requiredFields.forEach((field) => {
            if (!medicationUpdate.hasOwnProperty(field)) {
                throw new BadRequestError(`Required field ${field} missing from request body `);
            }
        })

        // Update medication entry in database
        const results = await db.query(
            `
                UPDATE medications
                SET     name = $1,
                        rxcui = $2,
                        strength = $3,
                        units = $4,
                        frequency = $5,
                        current_pill_count = $6,
                        total_pill_count = $7
                WHERE id = $8
                RETURNING   id,
                            name,
                            rxcui,
                            strength,
                            units,
                            frequency,
                            current_pill_count,
                            total_pill_count,
                            user_id
            `, [medicationUpdate.name, medicationUpdate.rxcui, medicationUpdate.strength, medicationUpdate.units, medicationUpdate.frequency,  medicationUpdate.current_pill_count, medicationUpdate.total_pill_count, medicationId]
        )
        
        return results.rows[0];          
    }

    static async deleteMedication({ medicationId }) {
        
        const results = await db.query(
            `
                DELETE FROM medications
                WHERE id = $1
                RETURNING *
            `, [medicationId]
        )

        return results.rows[0];
    }

    static async refillMedication({ refillAmount, medicationId }) {
        if(!refillAmount) {
            throw new BadRequestError("No refill amount provided");
        }

        const results = await db.query(
            `
                UPDATE medications
                SET     current_pill_count = current_pill_count + $1
                WHERE id = $2
                RETURNING   id,
                            name,
                            rxcui,
                            strength,
                            units,
                            frequency,
                            current_pill_count,
                            total_pill_count,
                            user_id
            `, [refillAmount, medicationId]
        )
        
        return results.rows[0];    
    }

}

module.exports = Medication; 