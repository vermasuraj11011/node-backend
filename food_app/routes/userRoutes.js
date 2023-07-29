const express = require('express')
const {
    getUsers,
    postUser,
    updateUser,
    deleteUser,
    getCookies,
    setCookies,
    getUser
} = require('../controller/userController')
const userRoute = express.Router()
const {
    isAuthorize,
    protectRoute,
    forgotPassword,
    logout,
    resetPassword
} = require('../controller/authController')


// user route
userRoute
    .route('/')
    // .get(getUsers)
    .post(postUser)
    // .patch(updateUser)
    // .delete(deleteUser)

userRoute
    .route('/getCookies')
    .get(getCookies)

userRoute
    .route('/setCookies')
    .get(setCookies)


userRoute
    .route('/logout')
    .get(logout)

userRoute.use(protectRoute)
userRoute
    .route('/:id/profile')
    .get(getUser)

userRoute
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)



userRoute.use(isAuthorize(['admin']))
userRoute
    .route('/')
    .get(getUsers)

userRoute
    .route('/forget_password')
    .post(forgotPassword)

userRoute
    .route('/reset_password/:token')
    .post(resetPassword)




module.exports = userRoute