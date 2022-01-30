const express = require("express")
const User = require("../db/model/User")
const router = new express.Router()

// Gets all users
router.get('/users', (req, res) => {
    User.find({})
        .then(users => res.send(users))
        .catch(err => res.status(500).send(err))
})

// Get an user with the given UID
// Eg => localhost:5000/users/1403
router.get('/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send("The user was not found")
            }
            res.send(user)
        })
        .catch(err => res.status(500).send(err))
})


// Updates an user with the given UID
// Eg. => localhost:5000/users/12222221
router.patch('/users/:id', async(req, res) => {
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true})
        if (!user){
            return res.status(400).send("The user was not found")
        }
        res.send(user)
    }
    catch(err){
        res.status(400).send(err)
    }
})

// Deletes an user with given UID
router.delete('/users/:id', async(req, res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user){
            return res.status(404).send("User does not exist")
        }
        res.send(user)
    }
    catch(err){
        res.status(500).send(err)
    }
})

// Creates an user with the given UID
// Eg. => localhost:5000/users/1401
router.post('/users/:id', async (req, res) => {
    try {
        const user = new User({ _id: req.params.id, ...req.body })
        await user.save()
        res.send(user)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = router