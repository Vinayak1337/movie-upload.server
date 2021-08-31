"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_gridfs_storage_1 = require("multer-gridfs-storage");
const mongoose_1 = __importDefault(require("mongoose"));
const gridfs_stream_1 = __importDefault(require("gridfs-stream"));
const express_1 = require("express");
const upload_1 = require("../Controllers/upload");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uploadRouter = express_1.Router();
const store = {
    videoStore: null,
    thumbnailStore: null,
};
const conn = mongoose_1.default.connection;
conn.once('open', () => {
    store.videoStore = gridfs_stream_1.default(conn.db, mongoose_1.default.mongo);
    store.thumbnailStore = gridfs_stream_1.default(conn.db, mongoose_1.default.mongo);
    store.videoStore?.collection('videos');
    store.thumbnailStore?.collection('thumbnails');
    store.thumbnailStore;
    console.log('Connected to Video Store & Thumbnail Store.');
});
const videosStorage = new multer_gridfs_storage_1.GridFsStorage({
    url: process.env['URI'] || '',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    file: async (_req, file) => ({
        bucketName: 'videos',
        filename: `${file.originalname}.${file.mimetype.replace('video/', '')}`,
    })
});
const thumbnailStorage = new multer_gridfs_storage_1.GridFsStorage({
    url: process.env['URI'] || '',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    file: async (_req, file) => ({
        bucketName: 'thumbnails',
        filename: `${file.originalname}.${file.mimetype.replace('image/', '')}`,
    })
});
const videoMulter = multer_1.default({ storage: videosStorage });
const thumbnailMulter = multer_1.default({ storage: thumbnailStorage });
uploadRouter.get('/thumbnail/:filename', upload_1.StreamThumbnail.bind(null, store));
uploadRouter.get('/video/:filename', upload_1.StreamVideo.bind(null, store));
uploadRouter.post('/video', videoMulter.single('video'), upload_1.UploadVideo);
uploadRouter.post('/thumbnail', thumbnailMulter.single('thumbnail'), upload_1.UploadThumbnail);
exports.default = uploadRouter;
