const mariadb = require()

module.exports = mariadb.createPool({
	host: process.env.DB_HOST || "localhost",
	user: process.env.DB_USER || "localNuxt",
	password: process.env.DB_PASSWORD || "localPassword",
	database: process.env.DB_NAME || "NuxtChat",
	connectionLimit: 5
})