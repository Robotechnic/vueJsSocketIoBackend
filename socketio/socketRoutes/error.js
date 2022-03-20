module.exports = (socket)=>{return (err) => {
	console.error("Socket error", err)
	if (err) {
		if (err.message === "EXPIRED_TOKEN" ||
			err.message === "INVALID_TOKEN") {
			socket.emit("error", err)
			socket.broadcast.emit("status", [{
				userId: socket.token.id,
				status: "disconnected"
			}])
			socket.disconnect()
		} else {
			socket.emit("error", {
				error: "Internal error",
				code: "INTERNAL"
			})
		}
	}
}}