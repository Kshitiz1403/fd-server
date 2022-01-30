const express = require("express")
const Restaurant = require("../db/model/Restaurant")
const router = new express.Router()

// Get all restaurants
router.get('/restaurants', (req, res) => {
    Restaurant.find({})
        .then(restaurants => {
            res.send(restaurants)
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

// Get restaurant by id
router.get('/restaurants/:id', (req, res) => {
    Restaurant.findById(req.params.id)
        .then(restaurant => {
            if (!restaurant) {
                return res.status(404).send("The restaurant was not found")
            }
            res.send(restaurant)
        })
        .catch(err => res.status(500).send(err))
})

// Creates a restaurant
router.post('/restaurants', async (req, res) => {
    try {
        const restaurant = new Restaurant(req.body)
        await restaurant.save()
        res.send(restaurant)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

router.patch('/restaurants/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!restaurant) {
            return res.status(400).send("The restaurant was not found")
        }
        res.send(restaurant)
    }
    catch (err) {
        res.status(500).send(err)
    }
})

// Deletes a restaurant by id
router.delete('/restaurants/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id)
        if (!restaurant) {
            return res.status(404).send("Restaurant does not exist")
        }
        res.send(restaurant)
    }
    catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router