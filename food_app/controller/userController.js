const userModel = require('../models/userModel')

module.exports.getCookies = function getCookies(req, res) {
    let cookie = req.cookies
    let value = cookie.isLoogedIn
    console.log(`cookies  ${cookie},value ${value}`)
    res.send('cookie recieved')
}

module.exports.setCookies = function setCookies(req, res) {
    // res.setHeader('Set-Cookie', 'isLoggedIn = true')
    res.cookie('isLoogedIn', true, { maxAge: 1000 * 60 * 60 * 24, secure: true, httpOnly: true })
    res.send('Cookies has been send')
}

// user related function

module.exports.getUser = async function getUser(req, res) {
    // console.log(req.params)
    let user = await userModel.findById(req.params.id)

    if (user) {
        res.json({
            user: user
        })
    } else {
        res.json({
            message: 'User Not found'
        })
    }
}

module.exports.getUsers = async function getUsers(req, res) {
    const users = await userModel.find()
    res.json({
        message: 'List of all users',
        users: users
    })
}

// module.exports.postUser = function postUser(req, res) {
//     // console.log(req.body)
//     user = req.body

//     res.json({
//         message: 'req recieved successfully',
//         user: user
//     })
// }

module.exports.updateUser = async function updateUser(req, res) {
    const id = req.params.id
    let user = await userModel.findById(id)
    if (user) {
        let updatedUserReq = req.body
        let keys = []
        for (let key in updatedUserReq) {
            keys.push(key)
        }

        for (let i = 0; i < keys.length; i++) {
            user[keys[i]] = updatedUserReq[keys[i]]
        }

        const updatedUser = await userModel.findOneAndUpdate({ _id: id }, user, { new: true })
        res.json({
            message: 'user updated successfully',
            user: updatedUser
        })
    } else {
        res.json({
            message: 'User not found'
        })
    }
}

module.exports.deleteUser = async function deleteUser(req, res) {
    const id = req.params.id
    const user = await userModel.findByIdAndDelete(id)
    if (user) {
        res.json({
            message: 'User delted successfully',
            user: user
        })
    } else {
        res.json({
            message: 'user not found',
        })
    }
}