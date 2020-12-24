/** @format */

const router = require("express").Router()
const User = require("../models/user.model")

const isLoggedIn = (req, res, next) => {
	const { user } = req.session
	if (user) {
		next()
	} else {
		res.send("you are not logged in")
	}
}

const hasPermission = (req, res, next) => {
	const { user } = req.session
	if (user.permission) {
		next()
	} else {
		res.send(" yo do not have permission to perform this action")
	}
}

router.route("/").get(isLoggedIn, hasPermission, (req, res) => {
	User.find()
		.then((users) => res.json(users))
		.catch((err) => res.status(404).json("Error: " + err))
})

router.route("/getDetails").post(isLoggedIn, (req, res) => {
	User.findOne({ username: req.body.username })
		.then((users) => res.json(users))
		.catch((err) => res.status(404).json("Error: " + err))
})

router.route("/getPermission").post(isLoggedIn, (req, res) => {
	User.findOne({ username: req.body.username })
		.then((user) => res.json(user.permission))
		.catch((err) => res.status(404).json("Error: " + err))
})

router.route("/delete/:id").delete(isLoggedIn, hasPermission, (req, res) => {
	User.findByIdAndDelete(req.params.id)
		.then(() => res.json("employee deleted successfully"))
		.catch((err) => res.status(404).json("Error: " + err))
})
router.route("/register").post(isLoggedIn, hasPermission, (req, res) => {
	const firstName = req.body.firstName
	const lastName = req.body.lastName
	const password = req.body.password
	const phoneNo = req.body.phoneNo
	const email = req.body.email
	const address = req.body.address
	const username = req.body.username
	const permission = req.body.permission

	const newUser = new User({
		password,
		username,
		email,
		phoneNo,
		address,
		firstName,
		lastName,
		permission,
	})

	newUser
		.save()
		.then(() => res.json("User added successfully"))
		.catch((err) => res.status(404).json("Error: " + err))
})

module.exports = router
