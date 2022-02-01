const mongoose = require("mongoose")
const validator = require("validator")

const Schema = mongoose.Schema

const dishesSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    nonveg: {
        type: Boolean,
        required: true
    },
    imageURI: {
        type:String, 
        validate(value){
            if (!validator.isURL(value)){
                throw new Error("This is not a valid URL")
            }
        }
    }
})

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
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
    dishes: [dishesSchema],
})

module.exports = mongoose.model("Restaurants", restaurantSchema)