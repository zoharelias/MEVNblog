const MovieSchema = require('../models/Movie.js');

module.exports.controller = (app) => {
    //fetch all movies from DB
    app.get('/movies',(req,res) =>{
        MovieSchema.find({},'name description release_year genre',(error,movies)=>{
            if(error) { console.log(error);}
            res.send ({
                movies,
            });
        });
    });
    
    // fetch a singel movie by ID
    app.get('/api/movies/:id', (req,res)=>{
        MovieSchema.findById(req.params.id, 'name description release_year genre', (error,movie)=>{
            if(error) { console.error(error)};
            res.send(movie);
        });
    });
    // add a new movie
    app.post('/movies',(req,res)=>{
        const newMovie = new MovieSchema({
            name: req.body.name,
            description: req.body.description,
            release_year: req.body.release_year,
            genre: req.body.genre,
        });

        newMovie.save((error,movie)=>{
            if(error) {console.log(error)};
            res.send(movie);
        });
    });
};