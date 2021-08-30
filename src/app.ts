import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import fs from 'fs'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { StaticOrigin, CustomOrigin } from '.'

dotenv.config()

const app = express()

app.use(cors({
    origin: (origin: StaticOrigin | CustomOrigin | undefined, cb: Function) => cb(null, origin),
}))

app.use(bodyParser.json())

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ message: err.message });
});

app.get('/', (_req: Request, res: Response) => {
    const htmlFile = fs.readFileSync('./index.html', 'utf8')
    res.send(htmlFile)
})

mongoose.connect(process.env['URI'] || '')
    .then(() => {
        console.log('✅ Connected to database.')

        app.listen(process.env['PORT'] || 8080, () => {
            console.log(`✅ Connected to port ${process.env['PORT'] || 8080}.`)
        });
    })
