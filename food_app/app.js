const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 5000
app.listen(port, function() {
    console.log(`App listerning to the fort ${port}`)
})


app.use(express.json())
app.use(cookieParser())

// mini app
const userRoute = require('./routes/userRoutes')
const authRoute = require('./routes/authRoutes')
const planRoute = require('./routes/planRoutes')
const reviewRoute = require('./routes/reviewRoutes')
const stripeRoute = require('./routes/stripeRoutes')

// base routes
app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/plan', planRoute)
app.use('/review', reviewRoute)
app.use('/payment', stripeRoute)