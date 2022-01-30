const mongoose = require("mongoose")
const validator = require("validator")

const Schema = mongoose.Schema

const dishesSchema = new Schema({
    name: String,
    price: Number,
    nonveg: Boolean,
    imageURI: String
})

const restaurantSchema = new Schema({
    name: String,
    rating: Number,
    hide: Boolean,
    cuisines: Array,
    imageURI: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("This is not a valid URL")
            }
        }
    },
    dishes: dishesSchema,
})

module.exports = mongoose.model("Restaurants", restaurantSchema)