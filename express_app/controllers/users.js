module.exports.controller = (app) => {
    //get users page
    app.get('/users',(req,res) => {
        res.render('users',{ 
            title : 'Users-Controllers',
            description: 'This is the users page description',
        });
    })
}