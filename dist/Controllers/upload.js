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
const StreamThumbnail = async (store, req, res) => {
    try {
        const thumbnail = await store.thumbnailStore?.files.findOne({ filename: req.params['filename'] });
        if (!thumbnail) {
            res.status(404).json('Did not find thumbnail');
            return;
        }
        const readStream = store.thumbnailStore?.createReadStream(thumbnail);
        readStream?.pipe(res);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(`Not found thumbnail | ${error.message}`);
    }
};
exports.StreamThumbnail = StreamThumbnail;
const StreamVideo = async (store, req, res) => {
    try {
        const video = await store.videoStore?.files.findOne({ filename: req.params['filename'] });
        if (!video) {
            res.status(404).json('Did not find video');
            return;
        }
        let { range } = req.headers;
        if (!range)
            range = '0';
        console.log(video["_id"]);
        const videoSize = video["length"];
        const startPos = Number(range.replace(/\D/g, ""));
        const endPos = videoSize - 1;
        const contentLength = endPos - startPos + 1;
        const headers = {
            "Content-Range": `bytes ${startPos}-${endPos}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": video["contentType"],
        };
        res.writeHead(206, headers);
        const readStream = store.videoStore?.createReadStream({
            _id: video["_id"],
            range: {
                startPos, endPos
            }
        });
        readStream?.pipe(res);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(`Not found video | ${error.message}`);
        return;
    }
};
exports.StreamVideo = StreamVideo;
