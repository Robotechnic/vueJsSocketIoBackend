const dbQuery = require("../utils/dbQuery.js")

module.exports = {
	async createUser(db, pseudo, password) {
		return await dbQuery(
			db,
			"INSERT INTO users (pseudo, password) values (?,?)",
			[pseudo, password]
		)
	},
	async userExist(db, pseudo) {
		return await dbQuery(
			db,
			"SELECT id, pseudo, password FROM users WHERE pseudo=?",
			[pseudo]
		)
	},
	async updateRefreshToken(db, userId, token) {
		return await dbQuery(
			db,
			"UPDATE users SET refreshToken=? WHERE id=?",
			[token, userId]
		)
	},
	async updatePseudo(db, userId, pseudo){
		return await dbQuery(
			db,
			"UPDATE users SET pseudo=? WHERE id=?",
			[pseudo, userId]
		)
	},
	async getUserInfo(db, userId){
		return await dbQuery(
			db,
			"SELECT id,pseudo FROM users WHERE id = ?",
			[userId]
		)
	}
}