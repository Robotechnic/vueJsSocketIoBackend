const jwt = require("jsonwebtoken")

module.exports = (token) => {
	try {
		jwt.verify(token, process.env.TOKEN_SECRET)
	} catch (err) {
		if (err.name === "JsonWebTokenError") {
			return {
				error: "Token is invalid",
				code: "INVALID_TOKEN"
			}
		}

		if (err.name === "TokenExpiredError") {
			return {
				error: "Token is expired",
				code: "EXPIRED_TOKEN"
			}
		}

		console.error(err) // log error only if it's unknown
		return {
			error: "Internal error",
			code: "INTERNAL"
		}
	}

	return {
		token: jwt.decode(token)
	}
}