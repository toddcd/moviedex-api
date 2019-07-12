require('custom-env').env('dev');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIEDEX = require('./MOVIEDEX.json');

const app = express();
const PORT = 8000;

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearToken(req, res, next) {

    const apiToken = process.env.API_TOKEN
    console.log(apiToken);

    const authToken = req.get('Authorization');

    if(!authToken || apiToken !== authToken.split(' ')[1]) {
        return res.status(401).json({error: 'Unauthorized request'})
    }

    next();
});

app.get('/movie', function handleGetMovie(req, res) {
    let response = MOVIEDEX.movies;

    if (req.query.genre) {
        response = response.filter(movie =>
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    };

    if (req.query.country) {
        response = response.filter(movie =>
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    };

    if (req.query.avg_vote) {
        response = response.filter(movie =>
            Number(movie.avg_vote) >= Number(req.query.avg_vote)
        )
    };

    res.json(response)
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
});
