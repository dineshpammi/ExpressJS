const express = require('express')
const router = express.Router()
const User = require('../models/users')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const secretKey = "useAnySecretTokenHere";
//post user
router.post('/signup', async (req, res) => {
    // const newUser = new User(req.body) //or we can use {name:req.body.name}
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({ name: req.body.name, email: req.body.email, password: hashedPassword })
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    }
    catch (err) {
        res.status(400).json({ message: "Invalid data" });
    }
})

//login user
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            throw new UnauthorizedException('Invalid email or password')
        }
        const isPasswordMatched = await bcrypt.compare(req.body.password, user.password)
        if (!isPasswordMatched) {
            throw new UnauthorizedException('Invalid email or password')
        }
        else {
            jwt.sign({ user: user }, secretKey, (err, token) => {
                res.json({ user: user, authToken: token })
            }, err => {
                throw new UnauthorizedException('Invalid email or password')
            })
        }
    }
    catch (err) {
        res.status(400).json({ message: "Invalid credentials" });
    }
})

//get user by id with headers 
router.get('/', async (req, res) => {
    try {
        const userID = req.userId
        if (userID) {
            const user = await User.findById(userID)
            res.json(user)
        }
        else {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
    }
    catch (err) {
        res.status(404).json({ message: "No user found" });
    }
})

module.exports = router