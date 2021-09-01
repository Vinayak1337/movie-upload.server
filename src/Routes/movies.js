const { Router } = require("express")
const { getMovies, postMovie } = require("../Controllers/movies")

const moviesRouter = Router();

moviesRouter.get('/:limit', getMovies)

moviesRouter.post('/', postMovie)

module.exports = moviesRouter