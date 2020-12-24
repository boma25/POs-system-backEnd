/** @format */

const express = require("express")
const session = require("express-session")
const cors = require("cors")
const mongoose = require("mongoose")
const userRoute = require("./routes/users.routes")
const inventoryRoute = require("./routes/inventory.routes")
const authRoute = require("./routes/auth.routes")

require("dotenv").config()

//server initialization
const app = express()
const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`Server is running at port ${port}`)
})

//MiddleWare section
app.use(
	cors({
		credentials: true,
		origin: [
			"http://localhost:3000",
			"https://naughty-saha-e41f45.netlify.app/",
		],
	})
)
app.use(express.json())
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		saveUninitialized: false,
		resave: false,
		cookie: {
			httpOnly: true,
			maxAge: parseInt(process.env.COOKIE_MAX_AGE),
			sameSite: false,
		},
	})
)
//Database connection
const uri = process.env.LOCAL_URI
mongoose.connect(uri, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
})

const connection = mongoose.connection
connection.once("open", () => {
	console.log("Mongo db connection successful")
})

//route section
app.use("/pos/auth", authRoute)
app.use("/pos/user", userRoute)
app.use("/pos/inventory", inventoryRoute)
