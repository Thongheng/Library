import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

// library
import express from 'express'
import expressLayouts from "express-ejs-layouts"
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

//route
import { router } from './routes/route.js'
import { authorRouter } from './routes/authors.js'
import { bookRouter } from './routes/books.js'



// variable
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()



// database  
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection



// database
db.on('error', error => console.error(error))
db.once('open', () => console.log('conneted to Database'))

// setup
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layout/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))



//server
app.use('/', router)
app.use('/authors', authorRouter) // authors route will start with /authors
app.use('/books', bookRouter) // books route will start with /books


app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running')
})