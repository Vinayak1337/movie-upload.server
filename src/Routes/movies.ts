import { Router } from "express"
import { getMovies, postMovie } from "../Controllers/movies"

const moviesRouter = Router();

moviesRouter.get('/', getMovies)

moviesRouter.post('/', postMovie)

export default moviesRouter