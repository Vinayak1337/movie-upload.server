"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movies_1 = require("../Controllers/movies");
const moviesRouter = express_1.Router();
moviesRouter.get('/', movies_1.getMovies);
moviesRouter.post('/', movies_1.postMovie);
exports.default = moviesRouter;
