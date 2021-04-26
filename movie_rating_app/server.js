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

const session = require('express-session'); //adding session


const app = express();
const router = express.Router();
const serveStatic = require('serve-static');
const history = require('connect-history-api-fallback');
const { config } = require('process');

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

//using the session
app.use(session({
    secret: config.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { httpOnly: false },
}));

app.use(passport.initialize());

//using the session
app.use(passport.session());

// connect to mongodb
//mongoose.connect('mongodb://localhost/movie_rating_app', function(){
// connect to mongodb as config.DB
mongoose.connect(config.DB, function(){
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
app.use(history);
app.use(serveStatic(__dirname + "/dist"));

//fetch the current user
router.get('/api/current_user', isLoggedIn, function(req, res){
    if(req.user) {
        res.send({ current_user: req.user });
    } else {
        res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
})

//check if user data is in the session or not
function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/');
    console.log('error! auth failed');
}

//logout and destroy the session
router.get('/api/logout', function(req,res){
    req.logout();
    res.send();
})

router.get('/',function(req,res){
    res.json({ message: 'API initialized!'});
});

const port = process.env.API_PORT || 8081;
app.use('/',router);
app.listen(port,function(){
    console.log(`api running on port ${port}`);
})