var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('file-system');
var mongoose = require('mongoose');
const User = require('./models/User');


var createError = require('http-errors');


//removed after added controllers
//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

//connect to mongodb via mongoos
mongoose.connect('mongodb://localhost:27017/express_app',function(){
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('App Error: ', err.stack);
});




 
const { getMaxListeners } = require('./models/User');
//include controllers
fs.readdirSync('controllers').forEach(function (file) {
  if(file.substr(-3) === '.js'){
    const route = require('./controllers/' + file);
    route.controller(app);
  }  
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//removed after added controllers
//app.use('/', indexRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, function() {console.log('Listening on port 3000');})


module.exports = app;


// //creating a user with mongoose schema
// //(imported user object)
// var user = new User( {name:'Jloake',email:'jloake@lol.com'}); //the schema is in User.js
// console.log(user.name);

// user.save((error)=>{
//   if(error)
//     console.log(error);
//   console.log('Added new user: ' + user.name);
// })


// //get all documents("records") in users collection ("table")
// User.find({},'name email', function(error,users){
//   if(error) {
//     console.error(error)
//   };
//   console.log({users:users});
// })

