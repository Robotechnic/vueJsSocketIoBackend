const friendQuery = require("../api/utils/friendQuery")

module.exports = (io,socket) => {return async () => {
	const { result, err } = await friendQuery.userFriends(io.db, socket.token.id)

	if (err) {
		socket.emit("error", new Error(err.code))
		return
	}

	const friendsId = []
	result.forEach((friend) => {
		friendsId.push(friend.userId)
	})

	const connected = []
	const sockets = await io.fetchSockets()
	sockets.forEach((socket) => {
		if (friendsId.includes(socket.token.id)) {
			connected.push({
				userId: socket.token.id,
				status: "connected"
			})
		}
	})

	socket.emit("status", connected)
}}