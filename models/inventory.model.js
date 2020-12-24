/** @format */

const mongoose = require("mongoose")

const Schema = mongoose.Schema

const InventorySchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		amount_in_stock: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

const Inventory = mongoose.model("Inventory", InventorySchema)

module.exports = Inventory
