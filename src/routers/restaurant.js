const express = require("express")
const Restaurant = require("../db/model/Restaurant")
const router = new express.Router()
require('dotenv').config()
const multer = require("multer")
const fs = require("fs")
const imgbbUploader = require("imgbb-uploader");
const { default: axios } = require("axios")

const upload = multer({
    dest: 'uploads',
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload an image. Supported file types are jpeg & png"))
        }
        cb(undefined, true)
    }
})


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

// Uploads image to a restaurants by id with image as key
router.post('/restaurants/:id/upload', upload.single('image'), async (req, res) => {
    let file = req.file

    const ext = file.mimetype.split('/')[1];

    fs.renameSync(`${file.path}`, `${file.path}.${ext}`);

    const response = await imgbbUploader(process.env.IMGBB_KEY, `uploads/${file.filename}.${ext}`)
    try {
        const resp = await axios.patch(`https://apifd.herokuapp.com/restaurants/${req.params.id}`, {
            imageURI: response.url
        })
        return res.send(resp.data)
    }
    catch (err) {
        return res.status(500).send(err.message)
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


// ------------------------------Dishes-------------------------------------------

// Create a dish by restaurant ID
router.post('/restaurants/:id/dishes', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id)
        if (!restaurant) {
            return res.status(404).send("Restaurant does not exist")
        }
        restaurant.dishes.push(req.body)
        try {
            await restaurant.save()
            res.send(restaurant)
        }
        catch (err) {
            res.status(400).send(err.message)
        }
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

// Gets a dish by restaurant id and dish id
router.get('/restaurants/:id/dishes/:dishID', (req, res) => {
    Restaurant.findById(req.params.id)
        .then(restaurant => {
            if (!restaurant) {
                return res.status(400).send("Restaurant does not exists")
            }
            const dish = restaurant.dishes.id(req.params.dishID)
            if (!dish) {
                return res.status(400).send("Dish does not exists")
            }
            return res.send(dish)
        })
        .catch(err => res.status(400).send(err))
})

router.get('/restaurants/:id/dishes', (req, res) => {
    Restaurant.findById(req.params.id)
        .then(restaurant => {
            if (!restaurant) {
                return res.status(400).send("Restaurant does not exists")
            }
            const dishes = restaurant.dishes
            return res.send(dishes)
        })
        .catch(err => res.status(400).send(err))
})
// Updates a dish by restaurant id and dish id
router.patch('/restaurants/:id/dishes/:dishID', (req, res) => {
    Restaurant.findById(req.params.id)
        .then(restaurant => {
            if (!restaurant) {
                return res.status(400).send("Restaurant does not exists")
            }
            const dish = restaurant.dishes.id(req.params.dishID)
            if (!dish) {
                return res.status(400).send("Dish does not exists")
            }
            dish.set(req.body)
            return restaurant.save()
        })
        .then(restaurant => res.send(restaurant.dishes.id(req.params.dishID)))
        .catch(err => res.status(400).send(err))
})

// Deletes a dish by restaurant ID and dish ID
router.delete('/restaurants/:id/dishes/:dishID', (req, res) => {
    Restaurant.findById(req.params.id)
        .then(restaurant => {
            if (!restaurant) {
                return res.status(400).send("Restaurant does not exists")
            }
            const dish = restaurant.dishes.id(req.params.dishID)
            if (!dish) {
                return res.status(400).send("Dish does not exists")
            }
            dish.remove()
            restaurant.save()
            res.send(dish)
        })
        .catch(err => res.status(400).send(err))
})

// Uploads image to a dish by restaurant id and dish id with image as key
router.post('/restaurants/:id/dishes/:dishID/upload', upload.single('image'), async (req, res) => {
    let file = req.file
    const ext = file.mimetype.split('/')[1];

    fs.renameSync(`${file.path}`, `${file.path}.${ext}`);
    const response = await imgbbUploader(process.env.IMGBB_KEY, `uploads/${file.filename}.${ext}`)
    console.log(response)

    Restaurant.findById(req.params.id)
        .then(restaurant => {
            if (!restaurant) {
                return res.status(400).send("Restaurant does not exists")
            }
            const dish = restaurant.dishes.id(req.params.dishID)
            if (!dish) {
                return res.status(400).send("Dish does not exists")
            }
            dish.set({ "imageURI": response.url })
            return restaurant.save()
        })
        .then(restaurant => res.send(restaurant.dishes.id(req.params.dishID)))
        .catch(err => res.status(400).send(err))
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

module.exports = router