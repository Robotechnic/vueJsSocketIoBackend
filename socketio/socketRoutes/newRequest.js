const userQuery = require("../../api/utils/userQuery")

module.exports = (db,socket) => {
	return async (token, request) => {
		const {result,err} = await userQuery.getUserInfo(db,request.from)

		if (err) {
			return next(new Error(err.code))
		}
		result[0].userId = result[0].id
		result[0].id = request.requestId
		socket.to(String(request.to)).emit("newRequest", result[0])
	}
}