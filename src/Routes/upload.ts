import multer from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage'
import { connection, mongo } from 'mongoose'
import Grid from 'gridfs-stream'
import { Router } from 'express'
import { GridFsStore } from '..'
import { StreamThumbnail, StreamVideo, UploadThumbnail, UploadVideo } from '../Controllers/upload'
import dotenv from 'dotenv'
dotenv.config()

const uploadRouter = Router();

const store: GridFsStore = {
    videoStore: null,
    thumbnailStore: null,
}


connection.once('open', () => {
    store.videoStore = Grid(connection.db, mongo)
    store.thumbnailStore = Grid(connection.db, mongo)

    store.videoStore?.collection('videos')
    store.thumbnailStore?.collection('thumbnails')
    store.thumbnailStore

    console.log('Connected to Video Store & Thumbnail Store.')
})

const videosStorage = new GridFsStorage({
    url: process.env['URI'] || '',
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
    url: process.env['URI'] || '',
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

export default uploadRouter