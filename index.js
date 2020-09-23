const express = require('express')
const bodyParser = require('body-parser')
require("dotenv").config();
const app = express()
const mysql = require('mysql')
var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/static', express.static("public"))
app.listen(3000, () => { console.log("App is running in port 3000!!") })
app.get("/", (req, res) => {
    res.render("index.ejs")
})
app.get("/login", (req, res) => {
    res.render("login.ejs", { message: "" })
})
app.get("/register", (req, res) => {
    res.render("register.ejs", { message: "" });
})

connection.connect(function(err) {
    if (err) {
        console.log(err.code);
        console.log(err.fatal);
    } else {
        console.log('Connected to Database!!')
    }
});

app.post("/register", (req, res) => {
    var FNAME = req.body.FirstName;
    var LNAME = req.body.LastName;
    var UNAME = req.body.UserName;
    var PASSWORD = req.body.Password;
    connection.query("SELECT * FROM USERS WHERE USER_NAME ='" + UNAME + "'", function(err, result, field) {
        if (result.length == 0) {
            var insert_query = "INSERT INTO USERS (FIRST_NAME,LAST_NAME,USER_NAME,PASSWORD) VALUES (?,?,?,?)"
            connection.query(insert_query, [FNAME, LNAME, UNAME, PASSWORD], function(err, data) {
                res.render("myworld.ejs", { Name: FNAME + " " + LNAME });
            })

        } else {
            res.render(
                "register.ejs", { message: "Username already exits !" }
            );
        }
    })
})
app.post("/myworld", (req, res) => {
    connection.query("SELECT * FROM USERS WHERE USER_NAME = '" + req.body.USERNAME + "' AND PASSWORD ='" + req.body.PASSWORD + "'", function(err, result, field) {
        if (result.length == 0) {
            console.log("Username not available")
            res.render("login.ejs", { message: " Username/Password incorrect ! " });
        } else {
            res.render("myworld.ejs", { Name: result[0].FIRST_NAME + " " + result[0].LAST_NAME })
        }
    })
})