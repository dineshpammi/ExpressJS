const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://127.0.0.1/crud-express' //db connection
const app = express()

mongoose.connect(url, { useNewUrlParser: true })
const con = mongoose.connection
con.on('open', () => { console.log('connected') })//on db connection
app.use(express.json())

const customerRouter = require('./routers/customers')   //add individual modules for routing
app.use('/customer', customerRouter)  //create a path to module

const userRouter = require('./routers/users')
app.use('/user', userRouter)

app.listen(9000, () => { console.log('server started'); })  //inform server where to listen

