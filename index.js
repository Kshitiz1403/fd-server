const express = require("express")
require('./src/db/mongoose')
const userRouter = require("./src/routers/user")
const restaurantRouter = require("./src/routers/restaurant")

const app = express()

const port = process.env.PORT || 5000

app.use(express.json())

app.use(userRouter)
app.use(restaurantRouter)

app.listen(port, () => {
    console.log(`listening at ${port}`)
})
