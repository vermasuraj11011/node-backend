const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')

app.listen(3000)
app.use(express.json())
app.use(cookieParser())

// mini app
const userRoute = require('./routes/userRoutes')
const authRoute = require('./routes/authRoutes')
const planRoute = require('./routes/planRoutes')
const reviewRoute = require('./routes/reviewRoutes')

// base routes
app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/plan', planRoute)
app.use('/review', reviewRoute)