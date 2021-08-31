"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moviesModel = void 0;
const mongoose_1 = require("mongoose");
const moveiSchema = new mongoose_1.Schema({
    id: mongoose_1.Schema.Types.ObjectId,
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
}, { minimize: false });
exports.moviesModel = mongoose_1.model('movies', moveiSchema);
