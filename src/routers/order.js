const express = require("express")
const Order = require("../db/model/Order")
const router = new express.Router()

router.get('/orders', (req, res) => {
    Order.find({})
        .then(orders => res.send(orders))
        .catch(err => res.status(500).send(err))
})

router.get('/orders/:id', (req, res) => {
    Order.findById(req.params.id)
        .then(order=>{
            if(!order){
                return res.status(404).send("The order was not found")
            }
            res.send(order)
        })
        .catch(err=>res.status(400).send(err))
})

router.post('/orders', async (req, res) => {
    try {
        const order = new Order({ ...req.body })
        await order.save()
        res.send(order)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

router.patch('/orders/:id', async(req, res)=>{
    try{
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, {new:true})
        if(!order){
            return res.status(400).send("The order was not found")
        }
        res.send(order)
    }
    catch(err){
        res.status(400).send(err)
    }
})

router.delete('/orders/:id', async(req, res)=>{
    try{
        const order = await Order.findByIdAndDelete(req.params.id)
        if (!order){
            res.status(400).send("The order does not exist")
        }
        res.send(order)
    }
    catch(err){
        res.status(500).send(err)
    }
})
module.exports = router