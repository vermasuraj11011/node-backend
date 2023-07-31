const express = require('express')
const { protectRoute } = require('../controller/authController')
const stripeRoute = express.Router()
const {
    paymentView,
    createSession
} = require('../controller/stripeController')

stripeRoute.use(protectRoute)
stripeRoute.post('/createSession', createSession)
stripeRoute.get('/createSession', paymentView)

module.exports = stripeRoute