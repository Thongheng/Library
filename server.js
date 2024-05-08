import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

// library
import express from 'express'
import expressLayouts from "express-ejs-layouts"
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { router } from './routes/route.js'
import mongoose from 'mongoose'


// variable
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection



// database
db.on('error', error => console.error(error))
db.once('error', () => console.log('conneted to Database'))

// setup
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layout/layout')
app.use(expressLayouts)
app.use(express.static('public'))



//server
app.use('/', router)

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running')
})