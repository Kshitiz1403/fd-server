const express = require("express")
require('./src/db/mongoose')
const User = require("./src/db/model/User")

const app = express()

const port = process.env.PORT || 5000

app.use(express.json())


// Gets all users
app.get('/users', (req, res) => {
    User.find({})
        .then(users => res.send(users))
        .catch(err => res.status(500).send(err))
})

// Get an user with the given UID
// Eg => localhost:5000/users/1403
app.get('/users/:id', (req, res) => {
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
app.patch('/users/:id', async(req, res) => {
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
app.delete('/users/:id', async(req, res)=>{
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
app.post('/users/:id', async (req, res) => {
    try {
        const user = new User({ _id: req.params.id, ...req.body })
        await user.save()
        res.send(user)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})


app.listen(port, () => {
    console.log(`listening at ${port}`)
})
