/** @format */

const router = require("express").Router()
const Inventory = require("../models/inventory.model")

const isLoggedIn = (req, res, next) => {
	const { user } = req.session
	if (user) {
		next()
	} else {
		res.json("you are not logged in")
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
router.route("/").get(isLoggedIn, (req, res) => {
	const { user } = req.session
	Inventory.find()
		.then((items) => {
			res.json(items)
		})
		.catch((err) => res.status(404).json("Error: " + err))
})

router.route("/edit").post(isLoggedIn, hasPermission, (req, res) => {
	Inventory.findOne({ name: req.body.name })
		.then((items) => {
			const new_amount =
				Number(items.amount_in_stock) + Number(req.body.new_amount)
			items.name = items.name
			items.price = Number(req.body.price)
			items.amount_in_stock = new_amount

			items
				.save()
				.then(() => res.json("product successfully updated"))
				.catch((err) => res.status(404).json("Error: " + err))
		})
		.catch((err) => res.status(404).json("Error: " + err))
})

router.route("/subtract/quantity").post(isLoggedIn, (req, res) => {
	Inventory.findOne({ name: req.body.name })
		.then((items) => {
			const new_amount = items.amount_in_stock - req.body.new_amount
			items.name = items.name
			items.price = Number(items.price)
			items.amount_in_stock = Number(new_amount)

			items
				.save()
				.then(() => res.json("product successfully updated"))
				.catch((err) => res.status(404).json("Error: " + err))
		})
		.catch((err) => res.status(404).json("Error: " + err))
})

router
	.route("/delete/item/:id")
	.delete(isLoggedIn, hasPermission, (req, res) => {
		Inventory.findByIdAndDelete(req.params.id)
			.then(() => res.json("item deleted"))
			.catch((err) => res.status(404).json("Error: " + err))
	})

router.route("/new").post(isLoggedIn, hasPermission, (req, res) => {
	const name = req.body.name
	const price = Number(req.body.price)
	const amount_in_stock = Number(req.body.quantity)

	const newProduct = new Inventory({
		name,
		price,
		amount_in_stock,
	})
	newProduct
		.save()
		.then(() => res.json("product successfully added"))
		.catch((err) => res.status(404).json("Error: " + err))
})

module.exports = router
