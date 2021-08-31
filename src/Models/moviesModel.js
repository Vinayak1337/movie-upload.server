const mongoose = require('mongoose')

const moveiSchema = new mongoose.Schema({
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

module.exports = mongoose.model('movies', moveiSchema)
