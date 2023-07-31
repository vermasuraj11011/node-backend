const mongoose = require('mongoose')

const db_link = 'mongodb://localhost:27017/food_app'
mongoose.connect(db_link, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((db) => {
        console.log('review db connected')
            // console.log(db)
    }).catch((error) => {
        console.log(error)
    })

// creating schema
const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review cannot be empty"]
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'userModel',
        require: [true, 'User cannot be empty']
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: 'planModel',
        require: [true, 'Plan cannot be empty']
    }
})

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name image'
    }).populate('plan')
    next()
})

// creating model
const reviewModel = mongoose.model('reviewModel', reviewSchema)

module.exports = reviewModel