\echo 'Delete and recreate medtracker db?'
\prompt 'Return for yes or control-C to cancel > ' answer

DROP DATABASE medtracker;
CREATE DATABASE medtracker;
\connect medtracker;

\i medtracker-schema.sql