const mongoose = require("mongoose")
// const User = require("./model/User")

mongoose.set('runValidators',true)
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/Food-Delivery")

// const user = new User({name: "Kshitiz", email: "a@gmail.com",})

// user.save().then(()=>console.log(user)).catch((err)=>console.log(err.message))