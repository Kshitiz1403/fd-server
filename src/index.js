const express = require("express")
require('./db/mongoose')
const userRouter = require("./routers/user")
const restaurantRouter = require("./routers/restaurant")
const orderRouter = require('./routers/order')
const cors = require("cors")

const app = express()
app.use(cors())

const port = process.env.PORT || 5000

app.use(express.json())

app.use(userRouter)
app.use(restaurantRouter)
app.use(orderRouter)

app.listen(port, () => {
    console.log(`listening at ${port}`)
})
