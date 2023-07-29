const mongoose = require('mongoose')
const emailValidate = require('email-validator')
const bcrypt = require('bcrypt')
const crypto = require('crypto')


const db_link = 'mongodb://localhost:27017/food_app'
mongoose.connect(db_link, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((db) => {
        console.log('user db connected')
            // console.log(db)
    }).catch((error) => {
        console.log(error)
    })

// creating schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function() {
            console.log('email ', this)
            return emailValidate.validate(this.email)
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 5
    },
    confirmPassword: {
        type: String,
        require: true,
        minLength: 5,
        validate: function() {
            return this.confirmPassword == this.password
        }
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    image: {
        type: String,
        default: '/home/suraj/Documents/node/node_backend/public/default.png'
    },
    resetToken: String
})

// mongo hooks eg :-  save, remove
userSchema.pre('save', function() {
    // console.log('before saving to db ', this)
    this.confirmPassword = undefined
})

userSchema.methods.createResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.resetToken = resetToken
    return resetToken
}

userSchema.methods.resetPasswordHandler = function(password, confirmPassword) {
    this.password = password
    this.confirmPassword = confirmPassword
    this.resetToken = undefined
}

// userSchema.pre('save', async function() {
//     let salt = await bcrypt.genSalt()
//     let hashString = await bcrypt.hash(this.password, salt)
//     this.password = hashString
// })

// userSchema.post('save', function(doc) {
//     console.log('after saving to db ', doc)
// })

// creating model
const userModel = mongoose.model('userModel', userSchema)

module.exports = userModel