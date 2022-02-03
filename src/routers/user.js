const express = require("express")
const { auth } = require("firebase-admin")
const deleteUser = require("../../firebase")
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

router.patch('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!user) {
            return res.status(400).send("The user was not found")
        }
        res.send(user)
    }
    catch (err) {
        res.status(400).send(err)
    }
})

//WARNING!!!! - validations do not run on this operation so use carefully
//Upserts the document i.e. creates or updates an existing document  
router.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true, useFindAndModify: false, new: true })
        res.send(user)
    }
    catch (err) {
        res.status(400).send(err)
    }
})

// Deletes an user with given UID
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send("User does not exist")
        }
        auth().deleteUser(req.params.id)
            .then(() => res.send("Successfully deleted"))
            .catch(() => res.status.send("Error deleting user"))
        res.send(user)
    }
    catch (err) {
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

// Gets an users cart with given UID
router.get('/users/:id/cart', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(400).send("User does not exists")
            }
            return res.send(user.cart)
        })
        .catch(err => res.status(400).send(err))
})

// Updates an users cart with given UID
router.patch('/users/:id/cart', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(400).send("User does not exists")
            }
            user.set({ "cart": req.body })
            return user.save()
        })
        .then(user => res.send(user.cart))
        .catch(err => res.status(400).send(err))
})

module.exports = router