const express = require("express")
const Restaurant = require("../db/model/Restaurant")
const router = new express.Router()
require('dotenv').config()
const multer = require("multer")
const fs = require("fs")
const imgbbUploader = require("imgbb-uploader");
const { default: axios } = require("axios")

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

// Uploads image to a restaurants by id with image as key
router.post('/restaurants/:id/upload', upload.single('image'), async (req, res) => {
    let file = req.file

    const ext = file.mimetype.split('/')[1];

    fs.renameSync(`${file.path}`, `${file.path}.${ext}`);

    const response = await imgbbUploader(process.env.IMGBB_KEY, `uploads/${file.filename}.${ext}`)
    console.log(response.url)
    try {
        const resp = await axios.patch(`http://1bd7-49-36-235-94.ngrok.io/restaurants/${req.params.id}`, {
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

module.exports = router