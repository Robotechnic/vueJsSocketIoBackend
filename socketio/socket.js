const { Server } = require("socket.io")
const tokenChecker = require("./middlewares/token")

module.exports = (server) => {
	const io = new Server(server, {
		serveClient: false
	})

	io.use((socket, next) => {
		console.log("New socket connection")
		if (socket.handshake.auth && socket.handshake.auth.token) {
			const result = tokenChecker(socket.handshake.auth.token)

			if (result.error)
				return next(new Error(result.code))
			
			socket.token = result.token
			if (!result.token.server){
				socket.join(`${result.token.id}`)
			} 

			return next()
		}
		return next(new Error("NO_REFRESH_TOKEN"))
	})


	io.on("connection", function (socket) {
		socket.use(require("./middlewares/socketAutentication"))

		socket.on("message", require("./socketRoutes/messages"))

		socket.on("getConnectedSockets", require("./socketRoutes/getConnectedSockets")(io, socket))

		socket.on("error", require("./socketRoutes/error")(socket))

		socket.on("acceptFriendRequest", require("./socketRoutes/acceptFriendRequest")(socket))
		socket.on("cancelFriendRequest", require("./socketRoutes/cancelFriendRequest")(socket))
		
		socket.on("disconnecting", () => {
			socket.broadcast.emit("status", [{
				userId: socket.token.id,
				status: "disconnected"
			}])
		})
		socket.broadcast.emit("status", [{
			userId: socket.token.id,
			status: "connected"
		}])
	})

	return io
}