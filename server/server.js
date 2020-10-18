require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const app = express();
// Custom API Scripts
const api = require('./api');
const db = require('./db');


const PORT = process.env.PORT || 3000;
const API_ROUTE = process.env.API_ROUTE || "api/v1";

const route = app.listen(PORT, () => {
    console.log("Server is up and running at: http://localhost:3000");
});

app.use(cors());
app.use(express.json());
app.use(bodyparser.json());
app.use(cookieparser());

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname + "/../public/")));

// session middleware - sets cookie
app.use(session({
    key: 'user_sid',
    secret: process.env.SECRET_ID,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000,
        secure: false,
        httpOnly: false
    }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};

// ------------------ LOGIN -------------------------
// route to check if user is authenticated
app.get("/auth", (req, res, next) => {
    if (req.session.user == "authenticated") {
        res.status(200).json({
            authenticated: true
        });
    } else {
        res.status(403).json({
            authenticated: false
        });
    }
});

app
    .get("/login", sessionChecker, (req, res) => {
        res.send(200).send("login/");
    })
    .post("/login", sessionChecker, (req, res) => {
        if (typeof req.body.username != 'undefined' && typeof req.body.password != 'undefined') {
            // Check database here for password and username in order to properly authenticate
            api.authenticateUser(db, req.body.username, req.body.password).then(results => {
                if (results != null) {
                    req.session.user = "authenticated";
                    req.session.username = req.body.username;
                    req.session.companyname = results.companyname;
                    res.status(200).redirect('/dashboard');
                } else {
                    res.status(200).json({
                        message: "There was an issue with the request",
                        error: "Password or Username are incorrect"
                    });
                }
            }).catch((e) => console.log(e));

        } else {
            res.status(200).json({
                message: "There was an issue with the request",
                error: "Password or Username are incorrect"
            })
        }
    });

// route for dashboard 
app.get("/home", (req, res) => {
    if (req.session.user == "authenticated" && req.cookies.user_sid) {
        res.status(200).redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// route for user logout
app.get('/logout', (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.clearCookie('authenticated');
        res.redirect('/login');
    } else {
        res.redirect('/login');
    }
});


// ------------------ REGISTER -------------------------
app
    .get("/register", (req, res, next) => res.status(200).send("/register"))
    .post("/register", (req, res, next) => {
        // TODO: HANDLE REGISTER
        let username = req.body.username;
        let password = req.body.password;
        let companyname = req.body.businessname;
        let address = req.body.address;
        let email = req.body.email;
        let city = req.body.city;
        let zip = req.body.zip;
        let phone = req.body.phone;
        if (api.registerBusiness(db, username, password, companyname, email, address, city, zip, phone)) {
            res.status(200).redirect("/login");
        } else {
            res.status(401).redirect("/register");
        }
    });

// ---------------------- API PRODUCT ROUTES -------------
app.get(`${API_ROUTE}/get-products`, (req, res, next) => {
    res.send({
        "products": ["one", "two", "three"]
    });
});

app.post(`${API_ROUTE}/add-product`, (req, res, next) => {

});

app.post(`${API_ROUTE}/remove-product`, (req, res, next) => {

});

// ---------------------- API BUSINESS ROUTES -------------
app.get(`${API_ROUTE}/get-business`, (req, res, next) => {

});

app.post(`${API_ROUTE}/remove-business`, (req, res, next) => {

});

// route for 404 error
app.get("*", (req, res, next) => {
    res.status(404).json({
        message: "Page not found"
    });
});