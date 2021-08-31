"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamVideo = exports.StreamThumbnail = exports.UploadVideo = exports.UploadThumbnail = void 0;
const baseurl = 'http://localhost:8080';
// const baseUrl = 'https://possibillion-sample-prj-server.herokuapp.com'
const UploadThumbnail = (req, res) => {
    res.status(200).json(`${baseurl}/upload/thumbnail/${req.file?.filename}`);
};
exports.UploadThumbnail = UploadThumbnail;
const UploadVideo = (req, res) => {
    res.status(200).json(`${baseurl}/upload/video/${req.file?.filename}`);
};
exports.UploadVideo = UploadVideo;
const StreamThumbnail = (store, req, res) => {
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
exports.StreamThumbnail = StreamThumbnail;
const StreamVideo = (store, req, res) => {
    store.videoStore?.files.findOne({ filename: req.params['filename'] }, (error, video) => {
        if (error) {
            res.status(500).json(error.message);
            return;
        }
        if (!video) {
            res.status(404).json('Video Not found');
            return;
        }
        let { range } = req.headers;
        if (!range)
            range = '0';
        console.log(video._id);
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
            _id: video._id,
            range: {
                startPos, endPos
            }
        });
        readStream?.pipe(res);
    });
};
exports.StreamVideo = StreamVideo;
