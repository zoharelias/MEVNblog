const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JatStrategy = passportJWT.Strategy;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = 'movieratingapplicationsecretkey';

const app = express();
const router = express.Router();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

// connect to mongodb
mongoose.connect('mongodb://localhost/movie_rating_app', function(){
    console.log('connection to db has been made');
})
.catch(err =>{
    console.error('DB error: ', err.stack);
    process.exit(1);
});

// include controllers
// fs.readdirSync('./src/conrollers').forEach(function(file){
//     if(file.substr(-3)==="js"){
//         const route = require('./src/controllers/' + file);
//         route.controller(app);
//     }
// });

// include controllers
fs.readdirSync("controllers").forEach(function(file){
    if(file.substr(-3)===".js"){
        const route = require("./controllers/" + file);
        console.log('app=',app);
        route.controller(app);
    }
    // else {
    //     console.log('ELSE');
    // }
});


router.get('/',function(req,res){
    res.json({ message: 'API initialized!'});
});

const port = process.env.API_PORT || 8081;
app.use('/',router);
app.listen(port,function(){
    console.log(`api running on port ${port}`);
})