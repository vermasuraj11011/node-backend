const express = require('express')
const authRoute = express.Router()
const {
    login,
    getSignUp,
    postSignUp,
    loginView,
    forgotPassword
} = require('../controller/authController')

// auth route
authRoute
    .route('/signup')
    .get(getSignUp)
    .post(postSignUp)

authRoute
    .route('/login')
    .get(loginView)
    .post(login)


// the next will trigger the getSignUp function
// function middleWare(req, res, next) {
//     console.log('middle ware run')
//     next()
// }



module.exports = authRoute