export const UploadThumbnail = (req, res) => {
    res.status(200).json(`possibillion-sample-prj-server.herokuapp.com/thumbnail/${req.file?.filename}`);
};
export const UploadVideo = (req, res) => {
    res.status(200).json(`https://possibillion-sample-prj-server.herokuapp.com/video/${req.file?.filename}`);
};
export const StreamThumbnail = (store, req, res) => {
    store.thumbnailStore?.files.findOne({ filename: req.params['filename'] }, (error, result) => {
        if (error) {
            res.status(500).json(error.message);
            return;
        }
        if (!result) {
            res.status(404).json('Thumbnail Not found');
            return;
        }
        const readStream = store.thumbnailStore?.createReadStream(result);
        readStream?.pipe(res);
    });
};
export const StreamVideo = (store, req, res) => {
    store.videoStore?.files.findOne({ filename: req.params['filename'] }, (error, video) => {
        if (error) {
            res.status(500).json(error.message);
            return;
        }
        if (!video) {
            res.status(404).json('Video Not found');
            return;
        }
        const { range } = req.headers;
        if (!range) {
            res.status(400).json('Video range was not specified');
            return;
        }
        const videoSize = video.length;
        const startPos = Number(range.replace(/\D/g, ""));
        const endPos = videoSize - 1;
        const contentLength = endPos - startPos + 1;
        const headers = {
            "Content-Range": `bytes ${startPos}-${endPos}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": video.contentType,
        };
        res.writeHead(206, headers);
        const readStream = store.videoStore?.createReadStream({
            filename: video.filename,
            range: {
                startPos, endPos
            }
        });
        readStream?.pipe(res);
    });
};
