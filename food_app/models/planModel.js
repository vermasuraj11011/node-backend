const { mode } = require('crypto-js')
const mongoose = require('mongoose')


const db_link = 'mongodb://localhost:27017/food_app'
mongoose.connect(db_link, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((db) => {
        console.log('plan db connected')
            // console.log(db)
    }).catch((error) => {
        console.log(error)
    })

const planSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        maxLength: [20, 'Plan name should be less than 20 characters'],
        unique: true
    },
    duration: {
        type: Number,
        require: true
    },
    price: {
        type: Number,
        require: [true, 'Price cannot be empty']
    },
    rating: {
        type: Number
    },
    discount: {
        type: Number,
        validate: [function() {
            return this.discount < 100;
        }, 'Discount should be less than 100']
    },
})

const planModel = mongoose.model('planModel', planSchema)

async function createPlan() {
    const plan = {
        name: 'Basic',
        duration: 30,
        price: 1000,
        rating: 5,
        discount: 20
    }
    let data = await planModel.create(plan)
        // let doc = new planModel(plan)
        // await doc.save()
    console.log(data)
}
// createPlan()

module.exports = planModel