const userQuery = require("../../api/utils/userQuery")

module.exports = (socket) => {
	return async (token, request) => {
		socket.to(String(request.to)).emit("acceptFriendRequest", request.requestId)
	}
}