const userModel = require('../models/userModel.js')
const jwt = require('jsonwebtoken')
const secrete = require('../../secrete.js')
const { sendEmail } = require('../utils/nodemailer.js')

module.exports.isAuthorize = function isAuthorize(roles) {
    return function(req, res, next) {
        // console.log('req role -> ', req.role)
        // console.log('roles -> ', roles)
        if (roles.includes(req.role) == true) {
            next()
        } else {
            res.status(401).json({
                message: 'User not authorize'
            })
        }
    }
}

module.exports.protectRoute = async function protectRoute(req, res, next) {
    const token = req.cookies.token
    if (token) {
        const payload = jwt.verify(token, secrete.JWT_KEY)
        if (payload) {
            const user = await userModel.findById(payload.payload)
                // console.log(user)
            req.role = user.role
            req.id = user._id
            next()
        } else {
            res.json({
                message: 'User not verified'
            })
        }
    } else {
        const client = req.get('User-Agent')
        if (client.includes('Mozilla') == true) {
            res.redirect('/login')
        }
        res.status(401).json({
            message: 'Operatiion not allowed'
        })
    }
}

module.exports.loginView = async function loginView(req, res) {
    res.sendFile('/home/suraj/Documents/node/node_backend/views/login.html')
}

module.exports.login = async function login(req, res) {
    const data = req.body
    if (data.email) {
        const user = await userModel.findOne({ email: data.email })
        if (user) {
            if (data.password === user.password) {
                const user_id = user['_id']
                    // console.log(JWT_KEY)
                const token = jwt.sign({ payload: user_id }, secrete.JWT_KEY)
                    // console.log(token)
                res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24, secure: true, httpOnly: true })
                res.json({
                    message: 'Loggin Successful'
                })
            } else {
                res.json({
                    message: 'Wrong password'
                })
            }
        } else {
            res.statusCode = 400
            res.json({
                message: 'user not found'
            })
        }
    } else {
        res.statusCode = 400
        res.json({
            message: 'Please provide the email address'
        })
    }
}

module.exports.getSignUp = function getSignUp(req, res) {
    res.sendFile('/home/suraj/Documents/node/node_backend/food_app/index.html')
}

module.exports.postSignUp = async function postSignUp(req, res) {
    try {
        let data = req.body
        const user = await userModel.create(data)
        sendEmail('signup', user)
        if (user) {
            res.json({
                message: 'user  added successfull',
                data: user
            })
        } else {
            throw new Error('Signup failed')
        }
    } catch (err) {
        res.status(500).json({
            err: err.message
        })
    }
}

module.exports.forgotPassword = async function(req, res) {
    const { email } = req.body
    try {
        const user = await userModel.findOne({ email: email })
        if (user) {
            const resetToken = user.createResetToken()
            const resetLink = `${req.protocol}://${req.getHost}/reset_password/${resetToken}`
                // send email link to user
            sendEmail('resetPassword', {
                resetPasswordLink: resetLink,
                email: email
            })
            res.json({
                message: 'email not register'
            })
        } else {
            res.json({
                message: 'email not register'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports.resetPassword = async function(req, res) {
    const { password, confirmPassword } = req.body
    const token = req.params.token
    const user = await userModel.findOne({ resetToken: token })
    if (user) {
        user.resetPasswordHandler(password, confirmPassword)
        await user.save()
        res.json({
            message: 'password change successfully'
        })
    } else {
        res.json({
            message: 'user not found'
        })
    }
}

module.exports.logout = async function(req, res) {
    try {
        const token = req.cookies.token
        if (token) {
            const payload = jwt.verify(token, secrete.JWT_KEY)
            if (payload) {
                const user = await userModel.findById(payload.payload)
                if (user) {
                    res.clearCookie('token', '', { maxAge: 1 })
                        // window.alert('logout successfully')
                    res.json({
                        message: 'user loggout successfully',
                        user: user
                    })
                } else {
                    res.status(400).json({
                        message: 'user not found'
                    })
                }
            } else {
                res.status(401).json({
                    message: 'Operatiion not allowed'
                })
            }
        } else {
            res.status(401).json({
                message: 'Operatiion not allowed'
            })
        }
    } catch (err) {
        res.json({
            message: err.message
        })
    }
}