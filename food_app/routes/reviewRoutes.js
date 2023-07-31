const express = require('express')
const reviewRoute = express.Router()
const {
    protectRoute
} = require('../controller/authController')
const {
    allReview,
    top3reviews,
    planReviews,
    createReview,
    updateReview,
    deleteReview
} = require('../controller/reviewController')

// review routes

reviewRoute.use(protectRoute)

reviewRoute.route('/')
    .get(allReview)

reviewRoute.route('/top')
    .get(top3reviews)

reviewRoute.route('/:id')
    .get(planReviews)
    .post(createReview)
    .patch(updateReview)
    .delete(deleteReview)

module.exports = reviewRoute