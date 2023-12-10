require('dotenv').config({ path: '../.env' });

/**
 * Returns the database credentials as a object
 * @returns {object} - The database credentials
 */
function getDatabaseCredentials() {
    return {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER ,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DB
    }
}


module.exports = {
    getDatabaseCredentials: getDatabaseCredentials,
}