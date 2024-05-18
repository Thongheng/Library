import express from "express";
const authorRouter = express.Router()
import { Author } from "../model/author.js"


// all author
authorRouter.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = RegExp(req.query.name, 'i')
    } 
    try {
        const authors =  await Author.find(searchOptions)
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        })
    } catch (error) {
        res.render('/')
    }
})

// new authir

authorRouter.get("/new", (req, res) => {
    res.render("authors/new", {author: new Author()})
})

// create author
authorRouter.post('/', async (req, res) => { 
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor =  await author.save()
        // res.redirect(`authors/${newAuthor.id}`)
        res.redirect(`authors`)
    } catch (error) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error Creating Author'
        })
    }
   
})

export {authorRouter}