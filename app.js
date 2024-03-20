const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://127.0.0.1/crud-express' //db connection
const app = express();
const secretKey = "useAnySecretTokenHere";
const jwt = require("jsonwebtoken");

const myMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (req.url == '/user/login' || req.url == '/user/signup') {//unauthorised urls
        next();
    }
    else if (token) {
        var idToken = token.split(' ')[1];
        jwt.verify(idToken, secretKey, async (err, decoded) => {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: 'Token expired' });
            } else if (err) {
                return res.status(403).json({ message: 'Failed to authenticate token' });
            }
            const userID = decoded.user._id
            req.userId = userID
        });
        next();
    }
    else {
        res.status(401).json({ message: 'Unauthorised' });
    }
};



mongoose.connect(url, { useNewUrlParser: true })
const con = mongoose.connection
con.on('open', () => { console.log('connected') })//on db connection
app.use(express.json())

app.use(myMiddleware);
const customerRouter = require('./routers/customers')   //add individual modules for routing
app.use('/customer', customerRouter)  //create a path to module
// app.use(myMiddleware);
const userRouter = require('./routers/users')
app.use('/user', userRouter)
app.listen(9000, () => { console.log('server started'); })  //inform server where to listen

