const sql = require('mssql')

const dbSettings = {
    user: process.env.SQL_SERVER_USERNAME,
    password: process.env.SQL_SERVER_PASSWORD,
    server: process.env.SQL_SERVER_NAME,
    database: process.env.SQL_SERVER_DATABASE,
    port: parseInt(process.env.SQL_SERVER_PORT),
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

async function connectionSQL() {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectionSQL;