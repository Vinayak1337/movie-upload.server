const baseurl = 'http://localhost:8080'
// const baseUrl = 'https://possibillion-sample-prj-server.herokuapp.com'

exports.UploadThumbnail = (req, res) => {
    res.status(200).json(`${baseurl}/upload/thumbnail/${req.file?.filename}`)
}

exports.UploadVideo = (req, res) => {
    res.status(200).json(`${baseurl}/upload/video/${req.file?.filename}`)
}

exports.StreamThumbnail = async (store, req, res) => {
    try {
        const thumbnail = await store.thumbnailStore.files.findOne({ filename: req.params['filename'] } )

        if (!thumbnail) {
            res.status(404).json('Did not find thumbnail')
            return
        }

        const readStream = store.thumbnailStore.createReadStream({ _id: thumbnail._id })
        readStream.pipe(res)
    } catch (error) {
        console.log(error)
        res.status(500).json(`Something went wrong. ${error.message}`)
    }
}

exports.StreamVideo = async (store, req, res) => {
    try {
        const video = await store.videoStore?.files.findOne({ filename: req.params['filename'] })

        if (!video) {
            res.status(404).json('Did not find video')
            return
        }

        
        let { range } = req.headers

        if (!range) range = '0'

        const videoSize = video["length"]
        const startPos = Number(range.replace(/\D/g, ""))
        const endPos = videoSize - 1

        const contentLength = endPos - startPos + 1
        const headers = {
            "Content-Range": `bytes ${startPos}-${endPos}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": video["contentType"],
        }

        
        const readStream = store.videoStore.createReadStream({
            _id: video["_id"],
            range: {
                startPos, endPos
            }
        })
        res.writeHead(206, headers)
        readStream.pipe(res)
    } catch (error) {
        console.log(error)
        res.status(500).json(`Something went wrong. ${error.message}`)
        return
    }
}