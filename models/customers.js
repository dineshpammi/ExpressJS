const mongoose = require('mongoose')
const customerSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String, required: true },
    address: { type: Object, required: true },
    company: { type: Object, required: true },
    createdBy: { type: String, required: false },
    isDeleted: { type: Boolean, required: false, default: false },
})

module.exports = mongoose.model('Customer', customerSchema)