const { Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

module.exports.connectToDatabase = async () => {
    try {
        const client = new Client({
            host: process.env.PGHOST,
            port: process.env.PGPORT,
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE
        });

        await client.connect();
        console.log('Connected to the database');
        
        return client;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};
