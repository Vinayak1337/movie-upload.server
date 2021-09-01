const moviesModel = require("../Models/moviesModel")

exports.getMovies =  async (req, res) => {
    try {
        const { limit } = req.params

        if (!limit) {
            res.status(400).json('Please provide movies limit.')
            return
        }

        if (!limit.match(/^\d+$/g)) {
            res.status(400).json('Invalid limit. You can only pass a number.')
            return
        }
    
        const movies = await moviesModel.find({}, { limit })
    
        res.status(200).json(movies)
    } catch (error) {
        res.status(500).json(`Something went wrong. ${error.message}`)
    }
}

exports.postMovie = async (req, res) => {
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
}