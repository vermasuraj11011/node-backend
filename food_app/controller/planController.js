const { json } = require('express')
const planModel = require('../models/planModel')

module.exports.allPlans = async function allPlans(req, res) {
    const plans = await planModel.find()
    res.json({
        message: 'List of plans',
        plans: plans
    })
}

module.exports.createPlan = async function createPlan(req, res) {
    const data = req.body
    const plan = await planModel.create(data)
    res.json({
        message: 'Plan added successfully',
        plan: plan
    })
}

module.exports.getPlanById = async function getPlanById(req, res) {
    const id = req.params.id
    const plan = await planModel.findById(id)
    if (plan) {
        res.json({
            message: 'Plan fetch successfull',
            plan: plan
        })
    } else {
        res.status(400)
            .json({
                message: "Plan does not exist"
            })
    }
}

module.exports.deletePlanById = async function deletePlanById(req, res) {
    const id = req.params.id
    const plan = await planModel.findByIdAndDelete(id)
    if (plan) {
        res.json({
            message: 'Plan deleted successfully',
            plan: plan
        })
    } else {
        res
            .status(400)
            .json({
                message: "Plan does not exist"
            })
    }
}

module.exports.updatePlanByID = async function updatePlanByID(req, res) {
    const id = req.params.id
    let plan = await planModel.findById(id)
    if (plan) {
        const updatePlan = req.body
        let keys = []
        for (let key in updatePlan) {
            keys.push(key)
        }
        for (let i = 0; i < keys.length; i++) {
            plan[keys[i]] = updatePlan[keys[i]]
        }
        const updatedPlan = await planModel.findOneAndUpdate({ _id: id }, plan, { new: true })
        res.json({
            message: "Plan Updated successfully",
            plan: updatedPlan
        })
    } else {
        res.status(400)
            .json({
                message: "Plan does not exist"
            })
    }
}

module.exports.top3Plan = async function top3Plan(req, res) {
    const top3Plans = await planModel.find().sort({ rating: -1 }).limit(3)
    res.json({
        message: "Top 3 plans are:",
        plans: top3Plans
    })
}