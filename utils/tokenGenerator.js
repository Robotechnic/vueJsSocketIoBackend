const jwt = require("jsonwebtoken")
const ms = require("ms")

// generate refresh token
const refreshToken = (id) => jwt.sign({
	id
}, process.env.TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE })

// generate access token
const accessToken = (id, ip) => [
	jwt.sign({
		id,
		ip
	}, process.env.TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }),
	ms(process.env.ACCESS_TOKEN_EXPIRE)
]


module.exports = (id, ip) => ({ accessToken: accessToken(id, ip), refreshToken: refreshToken(id) })
module.exports.accessToken = accessToken
module.exports.refreshToken = refreshToken