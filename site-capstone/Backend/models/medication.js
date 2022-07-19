const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Medication {

    static async createMedication({medication}) {
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
                INSERT INTO medications (name, strength, units, frequency, rxcui, current_pill_count, total_pill_count)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING   id,
                            name,
                            rxcui,
                            strength,
                            units,
                            frequency,
                            current_pill_count,
                            total_pill_count
            `, [medication.name, medication.strength, medication.units, medication.frequency, medication.rxcui, medication.current_pill_count, medication.total_pill_count]
        )
        
        return results.rows[0];  
    }
    
    

}

module.exports = Medication; 