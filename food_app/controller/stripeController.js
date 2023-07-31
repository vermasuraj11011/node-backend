const secrete = require('../../secrete')
const stripe = require('stripe')(secrete.STRIPE_SECRET_KEY);
const planModel = require('../models/planModel')
const userModel = require('../models/userModel')

module.exports.paymentView = function(req, res) {
    res.sendFile('/home/suraj/Documents/node/node_backend/views/payment.html')
}

module.exports.createSession = async function(req, res) {
    try {
        const token = req.cookies.token
        if (token) {
            const userId = jwt.verify(token, secrete.JWT_KEY)
            if (userId) {
                const planId = req.params.planId
                const user = await userModel.findById(userId.payload)
                const plan = await planModel.findById(planId)
                const session = await stripe.checkout.sessions.create({
                    payment_method_type: ['card'],
                    cusomer_email: user.email,
                    clien_reference_id: plan._id,
                    line_items: [{
                        name: plan.name,
                        price: plan.price,
                        currency: "inr",
                        quantity: 1
                    }],
                    success_url: `${req.protocol}://${req.get('host')}/views/success.html`,
                    cancel_url: `${req.protocol}://${req.get('host')}/views/cancel.html`,
                })
                res.json({
                    status: "Success",
                    session
                })
            } else {
                throw new Error('User not found')
            }
        } else {
            throw new Error('Please login again')
        }

    } catch (err) {
        res.status(500).json({
            message: 'Payment failed',
            err: err.message
        })
    }
}