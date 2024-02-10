const { createConnection } = require('typeorm');
const ormconfig = require('./database');

let connection; // Store the connection globally


async function initializeConnection() {
  try {
    // Connect to PostgreSQL
    // if(!connection){
    // connection = await createConnection(ormconfig);

    // console.log('Connected to PostgreSQL database');
    // }
    if (!connection) {
      try {
        connection = getConnection('default');

        if (!connection.isConnected) {
          // If the connection exists but is not connected, connect it.
          await connection.connect();
        }
      } catch (error) {
        // If the connection doesn't exist, create it.
        connection = await createConnection(ormconfig);
        console.log('Connected to PostgreSQL database');
      }
    }


  } catch (error) {
    console.error('Connection failed:', error);
  }
}
function getConnection() {
  if (!connection) {
    throw new Error('Database connection has not been initialized.');
  }
  return connection;
}






module.exports = { initializeConnection, getConnection };


