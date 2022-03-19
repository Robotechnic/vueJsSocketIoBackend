const dbQuery = require("./dbQuery")

module.exports = {
	async userFriends(db,userId){
		return await dbQuery(
			db,
			"SELECT " +
				"u.id AS userId, pseudo FROM users AS u " +
			"INNER JOIN " +
				"friends AS f1 ON f1.userId1 = u.id OR f1.userId2 = u.id " +
			"WHERE " +
				"u.id != ? AND(f1.userId2 = ? OR f1.userId1 = ?) AND f1.pending = false",
			[userId, userId, userId]
		)
	},

	async hasFriend(db,userId,friendId) {
		return await dbQuery(
			db,
			"SELECT " +
				"u.id AS userId,pseudo FROM users AS u " +
			"INNER JOIN " +
				"friends AS f1 ON f1.userId1 = u.id OR f1.userId2 = u.id " +
			"WHERE " +
				"u.id != ? AND (    (f1.userId2 =? AND f1.userId1 =?) "+
						      " OR  (f1.userId2 =? AND f1.userId1 =?)) "+
				"AND f1.pending = false",
			[userId, userId, friendId, friendId, userId]
		)
	},

	async allFriendsRelations(db, userId) {
		return await dbQuery(
			db,
			"SELECT " +
				"u.id AS userId FROM users AS u " +
			"INNER JOIN " +
				"friends AS f1 ON f1.userId1 = u.id OR f1.userId2 = u.id " +
			"WHERE " +
				"u.id != ? AND(f1.userId2 =? OR f1.userId1 =?)",
			[userId, userId, userId]
		)
	},
	
	async searchFriend(db,userId,friendName,excludedId=[]) {
		return await dbQuery(
			db,
			"SELECT id AS userId, pseudo FROM users WHERE id != ? AND pseudo LIKE '%" + friendName + "%' AND id NOT IN (?)",
			[userId, excludedId]
		) 
	},

	async addFriendRequest(db, userId, friendId) {
		return await dbQuery(
			db,
			"INSERT INTO friends (userId1,userId2) VALUES (?,?)",
			[userId,friendId],
			false
		)
	},

	async acceptFriendRequest(db, requestId) {
		return await dbQuery(
			db,
			"UPDATE friends SET pending=false WHERE id=?",
			[requestId]
		)
	},

	async cancelFriendRequest(db, requestId) {
		return await dbQuery(
			db,
			"DELETE FROM friends WHERE id=? RETURNING *",
			[requestId]
		)
	},

	async getFriendRequest(db, userId) {
		return await dbQuery(
			db,
			"SELECT f.id AS id, u.id AS userId, pseudo FROM users u INNER JOIN friends f ON f.userId2=u.id AND pending=true WHERE userId1=?",
			[userId]
		)
	},

	async getFriendDemands(db, userId) {
		return await dbQuery(
			db,
			"SELECT f.id AS id, u.id AS userId, pseudo FROM users u INNER JOIN friends f ON f.userId1=u.id AND pending=true WHERE userId2=?",
			[userId]
		)
	}
}