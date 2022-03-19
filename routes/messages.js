const tokenChecker = require("../middleware/token")
const dbQuery = require("../utils/dbQuery.js")
const fields = require("../middleware/requiredFields")

module.exports = (db) => {
	const router = require("express").Router()

	router.post("/lastMessages", tokenChecker, fields(["friendId"]), async (req,res)=>{
		const body = req.body

		body.friendId = Number(body.friendId)

		const { result, err } = await dbQuery(
			db, 
			"SELECT * FROM (SELECT id,userId,message,creation FROM messages WHERE (userId=? AND friendId=?) OR (userId=? AND friendId=?) ORDER BY creation DESC LIMIT 10)last ORDER BY creation ASC",
			[req.token.id, body.friendId, body.friendId, req.token.id]
		)

		if (err){
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}
		
		
		res.json({
			totalMessages: result?.length ?? 0,
			messages: result ?? []
		})
	})

	router.post("/messagesBefore", tokenChecker, fields(["friendId","messageId"]), async (req, res) => {
		const body = req.body

		body.friendId = Number(body.friendId)

		const { result, err } = await dbQuery(
			db,
			"SELECT * FROM (SELECT id,userId,message,creation FROM messages WHERE ((userId=? AND friendId=?) OR (userId=? AND friendId=?)) AND id < ? ORDER BY creation DESC LIMIT 10)messages ORDER BY creation ASC",
			[req.token.id, body.friendId, body.friendId, req.token.id, body.messageId]
		)

		if (err) {
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}


		res.json({
			totalMessages: result?.length ?? 0,
			messages: result ?? []
		})
	})

	return router
}