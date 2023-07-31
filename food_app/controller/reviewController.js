const reviewModel = require('../models/reviewModel')
const planModel = require('../models/planModel')
const jwt = require('jsonwebtoken')
const JWT_KEY = require('../../secrete.js')

module.exports.allReview = async function allReview(req, res) {
    try {
        const reviews = await reviewModel.find()
        res.json({
            message: 'reviews are',
            reviews: reviews
        })
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports.top3reviews = async function(req, res) {
    try {
        const reviews = await reviewModel.find().sort({ rating: -1 }).limit(3)
        res.json({
            message: 'top 3 reviews',
            reviews: reviews
        })
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports.planReviews = async function(req, res) {
    try {
        const id = req.params.id
        const planReviews = await reviewModel.find({ plan: id })
        res.json({
            message: 'Reviews for plan with id ',
            id,
            reviews: planReviews
        })
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports.createReview = async function(req, res) {
    try {
        console.log("create ", req.body)
        const planId = req.params.id
        let plan = await planModel.findById(planId)
        if (plan) {
            const token = req.cookies.token
            if (token) {
                const userId = jwt.verify(token, JWT_KEY.JWT_KEY)
                console.log(userId)
                if (userId) {
                    let review = {
                        review: req.body.review,
                        rating: req.body.rating,
                        user: userId.payload,
                        plan: planId
                    }
                    const reviewSaved = await reviewModel.create(review)
                    console.log(reviewSaved)
                    const ratingCount = await reviewModel
                        .countDocuments({
                            plan: planId,
                            rating: { $ne: null },
                            _id: { $ne: reviewSaved._id }
                        });
                    console.log("rating count ", ratingCount)

                    if (reviewSaved) {
                        const updatedRating = (ratingCount * plan.rating + reviewSaved.rating) / (ratingCount + 1)
                        console.log("updatedRating ", updatedRating)
                        plan.rating = updatedRating
                        const updatedPlan = await planModel.findOneAndUpdate({ _id: planId }, plan, { new: true })
                        res.json({
                            message: 'review added',
                            review: reviewSaved,
                            plan: updatedPlan
                        })
                    } else {
                        throw new Error('Review not saved')
                    }
                } else {
                    res.status(400).json({
                        message: 'user not found'
                    })
                }
            } else {
                res.status(401).json({
                    message: 'UnAutorise'
                })
            }
        } else {
            res.status(400)
                .json({
                    message: 'Plan not found with the id: ',
                    planId
                })
        }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports.updateReview = async function(req, res) {
    try {

        const review = await reviewModel.findById(req.params.id)
        if (review) {
            const reviewReq = req.body
            const rating = review.rating
            let keys = []
            for (let key in reviewReq) {
                keys.push(key)
            }
            console.log("keys ", keys)
            for (let i = 0; i < keys.length; i++) {
                review[keys[i]] = reviewReq[keys[i]]
            }
            console.log("review ", review)
            const updatedReview = await reviewModel.findOneAndUpdate({ _id: review.id }, review, { new: true })
            console.log("updatedReview ", updatedReview)
            if (reviewReq.hasOwnProperty('rating') && reviewReq.rating != rating) {
                const planId = updatedReview.plan
                let plan = await planModel.findById(planId)
                console.log("plan ", plan)
                const ratingCount = await reviewModel
                    .countDocuments({
                        plan: planId,
                        rating: { $ne: null }
                    });
                console.log("rating count ", ratingCount)
                const updatedRating = (ratingCount == 0) ? 0 : ((ratingCount * plan.rating - rating + updatedReview.rating) / ratingCount)
                console.log("updated rating ", updatedRating)
                plan.rating = updatedRating
                const updatedPlan = await planModel.findOneAndUpdate({ _id: planId }, plan, { new: true })
                console.log("updated plan ", updatedPlan)
                res.json({
                    message: 'review updated',
                    review: updatedReview,
                    plan: updatedPlan
                })
            } else {
                res.json({
                    message: 'review updated',
                    review: updatedReview
                })
            }
        } else {
            throw new Error('Review not found with id ', id)
        }
    } catch (err) {
        res.status(404).json({
            error: err.message
        })
    }
}

module.exports.deleteReview = async function(req, res) {
    try {
        const reviewId = req.params.id
        console.log(reviewId)
        const reviewDeleted = await reviewModel.findByIdAndDelete(reviewId)
        console.log(reviewDeleted)
        if (reviewDeleted) {
            const planId = reviewDeleted.plan
            let plan = await planModel.findById(planId)
            console.log("plan ", plan)
            const ratingCount = await reviewModel
                .countDocuments({
                    plan: planId,
                    rating: { $ne: null }
                });
            console.log("rating ocunt ", ratingCount)
            const updatedRating = (ratingCount === 1) ? 0 : (ratingCount * plan.rating - reviewDeleted.rating) / (ratingCount - 1)
            console.log("updated rating ", updatedRating)
            plan.rating = updatedRating
            const updatedPlan = await planModel.findOneAndUpdate({ _id: planId }, plan, { new: true })
            console.log("updated plan ", updatedPlan)
            res.json({
                message: 'review deleted successfully',
                review: reviewDeleted,
                plan: updatedPlan
            })
        } else {
            res.json({
                message: 'review deleted successfully',
                review: reviewDeleted,
            })
        }
    } catch (err) {
        res.status(404).json({
            error: err.message
        })
    }
}