const User = require('../models/User.js');

const passportJWT = require('passport-jwt');
const ExtractJWT = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

//const ExtractJWT = passportJWT.ExtractJwt;
const jwtOptions = {};
//jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = 'thisisthesecretkey';

const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');

module.exports.controller = (app) => {
    //local strategy
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, (email, password, done) => {
        User.getUserByEmail(email, (err, user) => {
            if(err) { return done(err);}
            if(!user) { return done( null, false);}
            User.comparePassword(password, user.password, (error, isMatch) => {
                if(isMatch) {
                    return done( null, user);
                }
                return done(null, false);
            });
            return true;
        });
    }));

    //user login (local strategy)
    app.post('/users/login',
        passport.authenticate('local', { failureRedirect: '/users/login' }),
        (req,res) => {
            res.redirect('/');
        });
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err,user);
        });
    });

    //register a user
    app.post('/users/register', (req,res)=>{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const newUser = new User({
            name,
            email,
            password,
        });
        User.createUser(newUser, (error,user)=>{
            if(error){
                res.status(422).json ({
                    message: 'Something wrong. Try again later',
                });
            }
            res.send({ user });
        });
    });

    //login a user
    app.post('/users/login', (req,res) => {
        if(req.body.email && req.body.password) {
            const email = req.body.email;
            const password = req.body.password;
            User.getUserByEmail(email, (err,user) => {
                if(!user){
                    res.status(404).json({message: 'user not exist'});
                } else {
                    User.comparePassword(password,user.password, (error,isMatch) =>{
                        if(error) throw error;
                        if(isMatch){
                            const payload = { id: user.id };
                            const token = jwt.sign(payload, jwtOptions.secretOrKey);
                            res.json({ message: 'OK', token});
                        } else {
                            res.status(401).json({ message: 'password incorrect'});
                        }
                    });
                }
            });
        }
    });
};

