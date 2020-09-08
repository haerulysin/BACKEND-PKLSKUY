const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");


//Initialize Apps
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Keys
const dbURI = require('./config/globalkeys').mongoDBURI;

//Koneksi MongooDB
mongoose.connect(
    dbURI,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(() => console.log("Koneksi MongoDB berhasil"))
    .catch(error => console.log("Koneksi MongoDB Gagal ("+error+")"));

//Routes
const users = require('./routes/user.route');

//MainApps
app.use(passport.initialize());
require('./config/passport')(passport);

app.use("/users",users);


const port = process.env.PORT || 5100;
app.listen(port, () => console.log("Server berjalan di http://localhost:"+port));
