import express from "express";
import { Books } from "../model/book.js";
import { Author } from "../model/author.js";

const bookRouter = express.Router();
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];


// Route to display all books
bookRouter.get('/', async (req, res) => {
    let query = Books.find();
    if (req.query.title != null && req.query.title != '') {
        query = query.where('title').equals(new RegExp(req.query.title, 'i'));
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }

    try {
        const books = await query.exec();
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.redirect('/');
    }
});

// Route to display the form to create a new book
bookRouter.get("/new", async (req, res) => {
    renderNewPage(res, new Books({ publishDate: new Date() }));
});

// Route to handle book creation
bookRouter.post('/',async (req, res) => {
    const { title, author, publishDate, cover, pageCount, description } = req.body;
    const book = new Books({
        title,
        author,
        publishDate: new Date(publishDate),
        pageCount,
        description
    });

    saveCover(book, cover)

    try {
        const newBook = await book.save();
        res.redirect('/books');
    } catch (error) {
        console.error(error);
        renderNewPage(res, book, true);
    }
});


async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors,
            book
        };
        if (hasError) params.errorMessage = 'Error Creating Book';
        res.render('books/new', params);
    } catch (error) {
        console.error(error);
        res.redirect('/books');
    }
}

function saveCover(book, coverEncoded) {
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type 
    }
}
export { bookRouter };
