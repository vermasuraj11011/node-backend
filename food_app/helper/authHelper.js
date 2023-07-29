const jwt = require('jsonwebtoken')
const JWT_KEY = require('../../secrete.js')

function protectRoute(req, res, next) {
    console.log(JWT_KEY)
    const isVerify = jwt.verify(req.cookies.token, JWT_KEY.JWT_KEY)
    if (isVerify) {
        next()
    } else {
        res.json({
            message: 'Operatiion not allowed'
        })
    }
}

module.exports = protectRoute