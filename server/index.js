const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const bcrypt = require('bcrypt');
const saltRounds = 10;


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


app.get('/login', (req, res) => {
    if (req.session.user) {
        //console.log('logged in');
        res.send({ loggedIn: true, user: req.session.user });
    } else {        
       // console.log('not logged in');
        res.send({ loggedIn: false });
    }
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
                        req.session.user = result;
                       // console.log(req.session.user);                 
                        res.send(result);
                    } else {
                        res.send({ message: "Wrong username/password combination!" });
                    }
                });
            } else {
                res.send({ message: "User Doesn't Exist" });
            }

        });
});



app.listen(3001, () => {
    console.log('Server is running on port 3001');
});