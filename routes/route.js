import { Books } from "../model/book.js";
import express from "express";
const router = express.Router()


router.get('/', async (req, res) => {
    let books
    try {
        books = await Books.find().sort({ createAt: 'desc'}).limit(10).exec()
    } catch (error) {
        console.log(error)
        books = []
    }
    res.render('index', { books: books})
})

export {router}