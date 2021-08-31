import { model, Schema } from 'mongoose'

const moveiSchema = new Schema({
    id: Schema.Types.ObjectId,
    movieName: {
        type: String,
        required: true,
    },
    releasedOn: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    watchTime: {
        type: Number,
        default: 0,
    },
    uploadedOn: {
        type: Date,
        default: new Date(),
    }
}, { minimize: false })

export const moviesModel = model('movies', moveiSchema)
