/** @format */

const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const Schema = mongoose.Schema



const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			minlength:4,
			unique:true
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		firstName: {
			type: String,
			required: true,trim: true,
			minlength: 3,

		},
		lastName: {
			type: String,
			required: true,trim: true,
			minlength: 3,

        },
        phoneNo: {
			type: Number,
            required: true,
            unique: true,
            minlength:10,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		address: {
			type: String,
			required: true,
		},
		permission:{
			type:Boolean,
			required: true,
		},
		
	},
	{
		timestamps: true,
	}
)
UserSchema.pre("save", async function (next) {
	try {
		const salt = "$2b$10$sRTBk26oqUzhr8SRHlfkdu"
		const hash = await bcrypt.hashSync(this.password, salt)
		this.password = hash
		next()
	} catch (e) {
		next(e)
	}
})

const User = mongoose.model("User", UserSchema)

module.exports = User
