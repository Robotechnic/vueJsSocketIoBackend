const dbQuery = require("../../utils/dbQuery")
const friendQuery = require("../../utils/friendQuery")
const htmlEscape = require("escape-html")

module.exports = (io, socket)=> {return async (token, message)  => {
	if (token.server) {
		return
	}
	// check db
	let { result, err } = await friendQuery.hasFriend(io.db, socket.token.id, message.to)

	if (err) {
		socket.emit("error", new Error(err.code))
		return
	}

	if (result.length === 0) {
		return
	}

	({ err, result } = await dbQuery(
		io.db,
		"INSERT INTO messages (userId,friendId,message) VALUES (?,?,?)",
		[socket.token.id, message.to, htmlEscape(message.message)]
	))

	if (err) {
		socket.emit("error", new Error(err.code))
		return
	}

	socket.to(`${message.to}`).emit("message", {
		message: message.message,
		from: socket.token.id
	})
}}