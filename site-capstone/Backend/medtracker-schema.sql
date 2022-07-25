CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    email       TEXT NOT NULL UNIQUE CHECK (POSITION('@' IN email) > 1),    
    password    TEXT NOT NULL,
    first_name  TEXT NOT NULL,
    last_name   TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE medications (
    id                  SERIAL PRIMARY KEY,
    name                TEXT NOT NULL,
    strength            INTEGER NOT NULL,
    units               TEXT NOT NULL,
    frequency           TEXT NOT NULL,
    rxcui               TEXT NOT NULL,
    current_pill_count  INTEGER NOT NULL,
    total_pill_count    INTEGER NOT NULL,
    user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    id                  SERIAL PRIMARY KEY,
    notification_time   TIMESTAMP NOT NULL,   
    dosage              INTEGER NOT NULL,
    has_taken           BOOLEAN NOT NULL DEFAULT FALSE,
    med_id              INTEGER NOT NULL REFERENCES medications(id) ON DELETE CASCADE
);