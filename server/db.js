const Pool = require("pg").Pool;
const pool = new Pool({
    user: "admin",
    password: "Sisadm1",
    host: "localhost",
    port: 5432,
    database: "users_app_db",
});

module.exports = pool;