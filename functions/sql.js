require('dotenv').config({ path: '../.env' });
const mysql = require('mysql');

/* The pool variable */
let GlobalPool = null;

/**
 * Returns the database credentials as a object
 * @param {boolean} multipleStatements - Whether or not to allow multiple statements in a query
 * @returns {object} - The database credentials
 * @deprecated - Use the pool instead of the credentials
 */
function getDatabaseCredentials(multipleStatements) {
    return {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DB,
        multipleStatements: multipleStatements ? true : false
    }
}

/**
 * Initializes the database pool
 */
function initializePool() {
    const pool = mysql.createPool(
        {
            connectionLimit: 100,
            multipleStatements: false,
            waitForConnections: true,
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DB,
        }
    );

    GlobalPool = pool;

    setInterval(() => {

        GlobalPool.query('Select 1', (err, results) => {
            if (err) {
                console.log('Error in the database connection');
                console.log(err);
            }
        });
    }, 300000); // 5 minutes 
}

/**
 * Returns the database pool
 * @returns {mysql.Pool} - The database pool
 */
function getPool() {
    if (GlobalPool !== null) {
        return GlobalPool;
    }
}


module.exports = {
    getDatabaseCredentials: getDatabaseCredentials,
    initializePool: initializePool,
    getPool: getPool
}