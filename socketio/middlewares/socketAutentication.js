const tokenChecker = require("./token")

module.exports = (packet, next) => {
	const result = tokenChecker(packet[1])
	if (result.error)
		return next(new Error(result.code))
	return next()
}