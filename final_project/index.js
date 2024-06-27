const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());


app.use("/customer",session({
    secret:"fingerprint_customer",
    resave: true,
    saveUninitialized: true,
    username: null   // i needed this to create a review with the current user session, that will help in delete and update review
    }))

app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, "fingerprint_customer");
        if (decoded.user) {
            req.session.username = decoded.user;
            next();
        } else {
            res.status(401).send('Invalid session.');
        }
    } catch (ex) {
        res.status(401).send('Invalid token.');
    }
});

const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
