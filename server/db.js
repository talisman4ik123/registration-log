const Pool = require("pg").Pool;
const pool = new Pool({
    user: "admin",
    password: "Sisadm1",
    host: "localhost",
    port: 5432,
    database: "registration_logbook",
});

module.exports = pool;