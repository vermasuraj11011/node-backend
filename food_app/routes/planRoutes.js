const express = require('express')
const planRoute = express.Router()
const {
    allPlans,
    createPlan,
    getPlanById,
    deletePlanById,
    updatePlanByID,
    top3Plan
} = require('../controller/planController')
const {
    isAuthorize,
    protectRoute
} = require('../controller/authController')

// plan route
planRoute.use(protectRoute)

planRoute
    .route('/')
    .get(allPlans)

planRoute
    .route('/top')
    .get(top3Plan)

planRoute
    .route('/:id')
    .get(getPlanById)

planRoute.use(isAuthorize(['admin']))
planRoute
    .route('/')
    .post(createPlan)

planRoute
    .route('/:id')
    .delete(deletePlanById)
    .patch(updatePlanByID)

module.exports = planRoute