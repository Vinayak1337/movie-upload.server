const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const moviesRouter = require('./Routes/movies')
const uploadRouter = require('./Routes/upload')

dotenv.config()

const app = express()

app.use(cors({
    origin: (origin, cb) => cb(null, origin),
}))

app.use(bodyParser.json())

app.use((err, _req, res, _next) => {
    res.status(500).json({ message: err.message })
})

app.get('/', (_req, res) => {
    const htmlFile = fs.readFileSync('./index.html', 'utf8')
    res.send(htmlFile)
})

app.use('/movies', moviesRouter)
app.use('/upload', uploadRouter)

mongoose.connect(process.env['URI'] || '')
    .then(() => {
        console.log('✅ Connected to database.')

        app.listen(process.env['PORT'] || 8080, () => {
            console.log(`✅ Connected to port ${process.env['PORT'] || 8080}.`)
        })
    })
