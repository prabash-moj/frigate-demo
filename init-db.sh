#!/bin/bash
set -e

# Create databases
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE frigate_db;
    CREATE DATABASE compreface_db;
    
    -- Create users with passwords
    CREATE USER frigate WITH PASSWORD 'dbpassword';
    CREATE USER compreface WITH PASSWORD 'dbpassword';
    
    -- Grant privileges
    GRANT ALL PRIVILEGES ON DATABASE frigate_db TO frigate;
    GRANT ALL PRIVILEGES ON DATABASE compreface_db TO compreface;
    
    -- Grant schema privileges
    \c frigate_db
    GRANT ALL ON SCHEMA public TO frigate;
    
    \c compreface_db
    GRANT ALL ON SCHEMA public TO compreface;
EOSQL

echo "Databases and users created successfully"
