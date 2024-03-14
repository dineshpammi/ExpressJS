const express = require('express')
const router = express.Router()
const Customer = require('../models/customers')

//get all customers
// router.get('/', async (req, res) => {
//     try {
//         const customers = await Customer.find()
//         res.json(customers)
//     }
//     catch (err) {
//         res.send(err)
//     }
// })

//get customers by id
router.get('/:id', async (req, res) => {
    try {
        const customers = await Customer.find({ id: req.params.id, isDeleted: false })
        res.json(customers)
    }
    catch (err) {
        res.status(404).json({ message: "Cutomer not found" });
    }
})

//query filter - without filter it will list all data 
router.get('/', async (req, res) => {
    const { limit, skip } = req.query;
    try {
        const customers = await Customer.find().sort('id').limit(limit).skip((skip) ? (skip) : 0)
        res.json(customers)
    }
    catch (err) {
        res.status(404).json({ message: "No data found" });
    }
})

//post customer
router.post('/', async (req, res) => {
    const newCustomer = new Customer(req.body) //or we can use {name:req.body.name}
    try {
        const savedCustomer = await newCustomer.save()
        res.json(savedCustomer)
    }
    catch (err) {
        res.status(400).json({ message: "Invalid data" });
    }
})

//update customer by ID 
router.patch('/:id', async (req, res) => {
    try {
        const customers = await Customer.findByIdAndUpdate(req.params.id, req.body, {
            new: false,
            runValidators: true,
        });
        res.json(customers)
    }
    catch (err) {
        res.status(404).json({ message: "Cutomer not found" });
    }
})

//post filter 
router.post('/search', async (req, res) => {
    try {
        let response;
        if (req?.body?.name) {//for pagination query 
            response = await Customer.find({ name: { $regex: new RegExp(req?.body?.name) }, id: { $lt: req?.body?.id } }).limit((req?.body?.limit) ? (req?.body?.limit) : 10).skip((req?.body?.skip) ? (req?.body?.skip) : 0)

        }
        else {
            response = await Customer.find().sort('id').limit((req?.body?.limit) ? (req?.body?.limit) : 10).skip((req?.body?.skip) ? (req?.body?.skip) : 0)
        }
        res.send(response)
    }
    catch (err) {
        res.status(400).json({ message: "Invalid filters" });
    }
})

//soft delete customer
router.delete('/:id', async (req, res) => {
    console.log(req.params.id);
    try {
        const deletedCustomer = await Customer.findByIdAndUpdate(req.params.id, { isDeleted: true }, {
            new: false,
            runValidators: true,
        });
        res.json({ msg: 'Customer Deleted' })
    }
    catch (err) {
        res.status(404).json({ message: "Cutomer not found" });
    }
})

module.exports = router