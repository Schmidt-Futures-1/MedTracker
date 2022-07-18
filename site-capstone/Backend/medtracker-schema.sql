CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    email       TEXT NOT NULL UNIQUE CHECK (POSITION('@' IN email) > 1),    
    password    TEXT NOT NULL,
    first_name  TEXT NOT NULL,
    last_name   TEXT NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE medications (
    id                  SERIAL PRIMARY KEY,
    name                TEXT NOT NULL,
    strength            INTEGER NOT NULL,
    units               TEXT NOT NULL,
    frequency           TEXT NOT NULL,
    rxcui               TEXT NOT NULL,
    dosage              INTEGER NOT NULL,
    times_per_day       INTEGER NOT NULL DEFAULT 1,
    remaining_medicine  INTEGER NOT NULL
);

CREATE TABLE notifications (
    id                  SERIAL PRIMARY KEY,
    notification_time   TIMESTAMP NOT NULL,   
    has_taken           BOOLEAN NOT NULL DEFAULT FALSE,
    med_id              INTEGER NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);