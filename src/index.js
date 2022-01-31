const express = require("express")
require('./db/mongoose')
const userRouter = require("./routers/user")
const restaurantRouter = require("./routers/restaurant")
const orderRouter = require('./routers/order')
const cors = require("cors")

const app = express()
app.use(cors())

const port = process.env.PORT || 5000

// const multer = require("multer")

// const upload = multer({
//     dest:'images'
// })

// app.post('/upload',upload.single('upload') ,(req, res)=>{
//     res.send("success!")
// })

app.use(express.json())

app.use(userRouter)
app.use(restaurantRouter)
app.use(orderRouter)

app.listen(port, () => {
    console.log(`listening at ${port}`)
})
