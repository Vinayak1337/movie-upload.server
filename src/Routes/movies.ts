import { Router } from "express"
import { moviesModel } from "../Models/moviesModel";

const moviesRouter = Router();

moviesRouter.get('/', async (req, res) =>  {
    try {
        const { limit } = req.body

        if (!limit) {
            res.status(400).json('Please provide movies limit.')
            return
        }
    
        const movies = await moviesModel.find({}, { limit })
    
        res.status(200).json(movies)
    } catch (error) {
        res.status(500).json(`Something went wrong. ${error.message}`)
    }
})

moviesRouter.post('/', async (req, res) => {
    try {
        const { movieName, releasedOn, language, thumbnailUrl, videoUrl } = req.body

        if (!(movieName || releasedOn || language | thumbnailUrl || videoUrl )) {
            res.status(400).json('Incomplete body provided')
            return
        }
    
        const movie = await new moviesModel({ movieName, releasedOn, language, thumbnailUrl, videoUrl }).save()

        res.status(200).json(movie)
    } catch (error) {
        res.status(500).json(`Something went wrong. ${error.message}`)
    }
})

export default moviesRouter