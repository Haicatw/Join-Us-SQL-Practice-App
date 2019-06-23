var express = require('express');
var bodyParser = require("body-parser");
var mySqlite = require('../module/MySqlite');

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const sql = new mySqlite();
sql.createUsersTable();

app.get("/", function(req, res){
    console.log("Request received");
    let count = await sql.getUserCount();
    console.log('Count: ' + count);
    res.render('home', {count: count});
});

app.post("/register", function(req, res) {
    let email = req.body.email;
    console.log(email);
    sql.insertData(email);
    res.redirect("/");
});

//sql.getAllUserData();

app.listen(8080, function(){
    console.log("Server running on port 8080. (ﾉ>ω<)ﾉ")
});
