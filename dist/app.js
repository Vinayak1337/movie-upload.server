"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const movies_1 = __importDefault(require("./Routes/movies"));
const upload_1 = __importDefault(require("./Routes/upload"));
dotenv_1.default.config();
const app = express_1.default();
app.use(cors_1.default({
    origin: (origin, cb) => cb(null, origin),
}));
app.use(body_parser_1.default.json());
app.use((err, _req, res, _next) => {
    res.status(500).json({ message: err.message });
});
app.get('/', (_req, res) => {
    const htmlFile = fs_1.default.readFileSync('./index.html', 'utf8');
    res.send(htmlFile);
});
app.use('/movies', movies_1.default);
app.use('/upload', upload_1.default);
mongoose_1.default.connect(process.env['URI'] || '')
    .then(() => {
    console.log('✅ Connected to database.');
    app.listen(process.env['PORT'] || 8080, () => {
        console.log(`✅ Connected to port ${process.env['PORT'] || 8080}.`);
    });
});
