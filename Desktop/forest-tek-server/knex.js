import { config } from 'dotenv';
import knex from 'knex';

// Load environment variables from .env file
config();

const knexConfig = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,  // Include DB_PORT if it's in your .env
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
};

// Create a Knex instance
const knexInstance = knex(knexConfig);

// Export the Knex instance
export default knexInstance; // Default export for Knex instance