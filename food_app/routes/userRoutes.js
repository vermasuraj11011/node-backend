const express = require('express')
const multer = require('multer')
const {
    getUsers,
    updateUser,
    deleteUser,
    getCookies,
    setCookies,
    getUser,
    uploadImage,
    uploadImageView
} = require('../controller/userController')
const userRoute = express.Router()
const {
    isAuthorize,
    protectRoute,
    forgotPassword,
    logout,
    resetPassword
} = require('../controller/authController')

const multerStorage = multer.diskStorage({
    destination: function(req, file, callBackFunc) {
        callBackFunc(null, '/home/suraj/Documents/node/node_backend/public/image')
    },
    filename: function(req, file, callBackFunc) {
        callBackFunc(null, `user-${Date.now()}.jpeg`)
    }
})

const filter = function(req, file, callBackFunc) {
    if (file.mimetype.startsWith('image')) {
        callBackFunc(null, true)
    } else {
        callBackFunc(new Error('File type should be of Image'))
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: filter
})

userRoute.route('/uploadImage')
    .get(uploadImageView)
    // .post(upload.single('photo'), uploadImage)
userRoute.post('/uploadImage', upload.single('photo'), uploadImage)

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