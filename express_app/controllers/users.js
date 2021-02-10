var User = require('../models/User');

module.exports.controller = (app) => {
    //get all users 
    app.get('/users',(req,res) => {
        User.find({},'name email', function(error,users){
            if(error) {console.log(error);}
            res.send(users);
        })
        //res.render('index',{ title : 'Usersl' });
    })

    //get a single user
    app.get('/users/:id',(req,res)=>{
        User.findById(req.params.id, 'name email', function(error, user){
            if (error) {console.log(error);}
            res.send(user);
        })
    })
}