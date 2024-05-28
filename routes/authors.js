import express from "express";
const authorRouter = express.Router()
import { Author } from "../model/author.js"
import { Books } from "../model/book.js";


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
        res.redirect(`authors/${newAuthor.id}`)
    } catch (error) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error Creating Author'
        })
    }
   
})

authorRouter.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id) 
        const books = await Books.find({author: author.id}).limit(6).exec()
        res.render('authors/show', {
            author: author,
            bookByAuthor: books
        })
    } catch (error) {
        res.redirect('/')
    }
})

authorRouter.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render("authors/edit", {author: author})        
    } catch (error) {
        console.log(error)
        res.redirect('/authors')
    }
})

authorRouter.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch (error) {
        if(author == null) {
            res.redirect('/')
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating Author'
            })
        }
    }
})

authorRouter.delete('/:id', async (req, res) => {
    try {
        await Author.deleteOne({ _id: req.params.id });
        res.redirect('/authors');
        console.log('delete successfully');
    } catch (error) {
        console.log(error);
        res.redirect(`/authors/${req.params.id}`);
    }
});

export {authorRouter}