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
                        u.email as "user_email"
                FROM medications AS m
                    JOIN users AS u ON u.id = m.user_id
                WHERE m.id=$1
            `, [medicationId]
        )

        const medication = results.rows[0];

        if (!medication) {
            throw new NotFoundError()
        }

        return medication;
    }

}

module.exports = Medication; 