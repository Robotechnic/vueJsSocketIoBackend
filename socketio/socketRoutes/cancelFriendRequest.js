const userQuery = require("../../api/utils/userQuery")

module.exports = (socket) => {
	return async (token, request) => {
		console.log(String(request.to))
		socket.to(String(request.to)).emit("cancelFriendRequest", request.requestId)
	}
}