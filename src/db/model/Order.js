const mongoose = require("mongoose")
const validator = require("validator")

const Schema = mongoose.Schema


const orderSchema = new Schema({
    restaurantID: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    dishes: {
        type: Array,
        required:true
    },
    status: {
        type: Number,
        required: true,
        validate(value) {
            if (!(value == 200 || 300 || 400)) {
                throw new Error("Only 200, 300 & 400 allowed")
            }
        }
    },
    amount: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("Order", orderSchema)