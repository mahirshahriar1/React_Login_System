const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');


const bcrypt = require('bcrypt');
const saltRounds = 10;
 

const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: "userId",
    secret: "makeaverybigsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    },
}));

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'loginsystem',
});

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query("SELECT Username FROM users WHERE Username = ?", [username], (err, result) => {
        if (err) {
            res.send({ err: err });
        }

        if (result.length > 0) {
            res.send({ message: "Username already exists" });
        } else {

            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.log(err);
                }
                db.query("INSERT INTO users (Username, Password) VALUES (?, ?)", [username, hash], (err, result) => {
                    console.log(err);
                });
            });
        }

    });
});

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        res.send('We need a token, please give it to us next time');
    } else {
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if (err) {
                res.json({ auth: false, message: 'You failed to authenticate' });

            } else {            
                req.userId = decoded.id;
                next();
            }
        });
    }
}


app.get('/isUserAuth', verifyJWT, (req, res) => {
    res.send('You are authenticated');
});

app.get('/login', (req, res) => {
    if (req.session.user) {
        //console.log('logged in');
        res.send({ loggedIn: true, user: req.session.user });
    } else {
        // console.log('not logged in');
        res.send({ loggedIn: false });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();     

    res.send('logged out');
});




app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;


    db.query("SELECT * FROM users WHERE Username = ?;", username,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }

            if (result.length > 0) {
                bcrypt.compare(password, result[0].Password, (error, response) => {
                    if (response) {
                        const id = result[0].id;
                        const token = jwt.sign({ id }, "jwtSecret", {
                            expiresIn: 300,
                        });
                        // console.log(req.session.user);  

                        req.session.user = result;
                        res.json({ auth: true, token: token, result: result });
                    } else {
                        res.json({ auth: false, message: "Wrong Username/Password Combination" });
                    }
                });
            } else {
                res.json({ auth: false, message: "No user exists" });
            }

        });
});



app.listen(3001, () => {
    console.log('Server is running on port 3001');
});