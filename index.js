const http = require("http");
const express = require("express")
const app = express()

require("dotenv").config()

const helmet = require("helmet")
app.use(helmet())

if (process.env.FRONTEND_URL) {
	const cors = require("cors")
	app.use(cors({
		origin: process.env.FRONTEND_URL
	}))
}

app.use((req, res, next)=>{
	express.json()(req,res,(err)=>{
		if (err?.status === 400){
			res.status(400).json({
				error:"invalid json",
				errorCode:"INVALID_JSON",
				message:err.message,
				body:err.body
			})
			return
		}
		next()
	})
})

const cookieParser = require("cookie-parser")
app.use(cookieParser())
app.use((req,res,next)=>{
	res.cookieSettings = {
		httpOnly: true,
		sameSite: true,
		secure: process.env.production ?? false
	}
	next()
})

const db = require("./utils/dbInit")

app.get("/",(req,res)=>{
	res.json({
		apiVersion:1.0,
		author:"Robotechnic",
		errorCodes: {
			"INTERNAL": "Some internal error appened",
			"EMPTY_FIELDS":"The request require some field which are not provided",
			"INVALID_FIELD_FIELDNAME":"The content of FIELDNAME is not valid",
			"PSEUDO_EXIST":"Provided pseudo alrealy exist",
			"USER_NOT_EXIST":"Selected user doesn't exist",
			"WRONG_PASSWORD":"Password is wrong",
			
			"NO_REFRESH_TOKEN":"There is no refresh token in cookie",
			"INVALID_REFRESH_TOKEN":"The refresh token has invalid signature",
			"EXPIRED_REFRESH_TOKEN":"The refresh token is expired",

			"INVALID_TOKEN":"Current access token is invalid",
			"EXPIRED_TOKEN":"Current token is outdated",
			"INVALID_TOKEN_IP":"Ip stored in token is different than ip provided by user",

			"DUPLICATE_FRIEND_REQUEST":"The current thing that you try to create alrealy exists",
			"USER_AUTO_FRIEND":"You can't be friend with yourself in this chat",
			"ALREALY_FRIEND":"This is alrealy your friend"
		}
	})
})

app.use("/friends", require("./routes/friends")(db))
app.use("/messages", require("./routes/messages")(db))
app.use("/user", require("./routes/user")(db))

const port = process.env.PORT || 3000
const server = http.createServer(app)

const io = require("socketio/socket.js")(server)

server.listen(port, () => {
	console.log(`API server listening on port ${port}`)
})