module.exports.controller = (app) => {
    //get users page
    app.get('/users',(req,res) => {
        res.render('index',{ title : 'Users'});
    })
}