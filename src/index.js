const express = require("express")
require('./db/mongoose')
const userRouter = require("./routers/user")
const restaurantRouter = require("./routers/restaurant")
const orderRouter = require('./routers/order')

const app = express()

const port = process.env.PORT || 5000

app.use(express.json())

app.use(userRouter)
app.use(restaurantRouter)
app.use(orderRouter)

app.listen(port, () => {
    console.log(`listening at ${port}`)
})
