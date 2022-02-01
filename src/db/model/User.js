const mongoose = require("mongoose");
const validator = require("validator")

const Schema = mongoose.Schema

const cartSchema = new mongoose.Schema({
    cartTotal:Number,
    dishes:Array,
    restaurantID:String,
    _id:false
})

const addressSchema = new Schema({
    _id:false,
    roomNumber:Number,
    hostel:String
})

const userSchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String
    },
    email: {
        type: String,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        },
        lowercase:true
    },
    phone:{
        type: Number,
        required:true
    },
    createdAt:{
        type: Date,
        immutable:true
    },
    signedInAt:{
        type:Date,
    },
    graduationYear:{
        type:Number
    },
    address:addressSchema,
    cart: cartSchema,
    orders:[mongoose.Schema.Types.ObjectId]
})

module.exports = mongoose.model("User", userSchema)