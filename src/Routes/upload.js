const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const { Router } = require('express')
const { StreamThumbnail, StreamVideo, UploadThumbnail, UploadVideo } = require('../Controllers/upload')
const dotenv = require('dotenv')
dotenv.config()

const uploadRouter = Router();

const store = {
    videoStore: null,
    thumbnailStore: null,
}

const conn = mongoose.connection
conn.once('open', () => {
    store.videoStore = Grid(conn.db, mongoose.mongo)
    store.videoStore.collection('videos')

    store.thumbnailStore = Grid(conn.db, mongoose.mongo)
    store.thumbnailStore.collection('thumbnails')

    console.log('Connected to Video Store & Thumbnail Store.')
})

const videosStorage = new GridFsStorage({
    url: process.env['URI'],
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    file: async (_req, file) => ({
        bucketName: 'videos',
        filename: `${file.originalname}.${file.mimetype.replace('video/', '')}`,
    })
})

const thumbnailStorage = new GridFsStorage({
    url: process.env['URI'],
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    file: async (_req, file) => ({
        bucketName: 'thumbnails',
        filename: `${file.originalname}.${file.mimetype.replace('image/', '')}`,
    })
})

const videoMulter = multer({ storage: videosStorage })
const thumbnailMulter = multer({ storage: thumbnailStorage })

uploadRouter.get('/thumbnail/:filename', StreamThumbnail.bind(null, store))

uploadRouter.get('/video/:filename', StreamVideo.bind(null, store))

uploadRouter.post('/video', videoMulter.single('video'), UploadVideo)

uploadRouter.post('/thumbnail', thumbnailMulter.single('thumbnail'), UploadThumbnail)

module.exports = uploadRouter