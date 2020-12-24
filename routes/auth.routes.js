/** @format */

const router = require("express").Router()
const User = require("../models/user.model")
const bcrypt = require("bcrypt")

router.route("/login").post((req, res) => {
	User.findOne({ username: req.body.username })
		.then(async function (user) {
			if (user === null) {
				res.json("user does not exist")
			} else {
				let password = req.body.password
				try {
					const salt = "$2b$10$sRTBk26oqUzhr8SRHlfkdu"
					const hash = await bcrypt.hashSync(password, salt)
					password = hash
					if (user.password === password) {
						req.session.user = user
						res.json("login successful")
					} else {
						res.json("password incorrect")
					}
				} catch (err) {
					console.log(err)
				}
			}
		})
		.catch((err) => res.status(404).json("Error " + err))
})

router.route("/reset").post((req, res) => {
	User.findOne({ username: req.body.username })
		.then(async function (user) {
			if (user === null) {
				res.json("user does not exist")
			} else {
				let password = req.body.password
				try {
					const salt = "$2b$10$sRTBk26oqUzhr8SRHlfkdu"
					const hash = await bcrypt.hashSync(password, salt)
					password = hash
					if (user.password === password) {
						user.password = req.body.newPassword
						user
							.save()
							.then(() => res.json("password successfully updated"))
							.catch((err) => res.status(404).json("Error " + err))
					} else {
						res.json("password incorrect")
					}
				} catch (err) {
					console.log(err)
				}
			}
		})
		.catch((err) => res.status(404).json("Error " + err))
})

router.route("/isLogged").get((req, res) => {
	if (req.session.user) {
		const isLoggedin = true
		const username = req.session.user.username
		const response = { isLoggedin, username }
		res.json(response)
	} else {
		res.json(false)
	}
})
router.route("/logout").get((req, res) => {
	if (req.session.user) {
		req.session.destroy()
		res.json("logged out")
	} else {
		res.json(false)
	}
})
module.exports = router
