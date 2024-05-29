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

//show book route
bookRouter.get('/:id', async (req, res) => {
    try {
        const book = await Books.findById(req.params.id).populate('author').exec()
        if (book.author) {
            res.render('books/show', {book: book})
        } else {
            // Handle the case where the author does not exist
            res.status(404).send('Author not found');
        }
    } catch (error) {
        res.redirect('/')
    }
})
//edit 
bookRouter.get("/:id/edit", async (req, res) => {
    try {
        const book = await Books.findById(req.params.id)
        renderEditPage(res, book);
    } catch (error) {
        res.redirect('/')
    }
});

bookRouter.put('/:id', async (req, res) => {
    let book 
    try {
        book = await Books.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if(req.body.cover != null && req.body.cover !== '') {
            saveCover(book, req.body.cover) 
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch (error) {
        if (book != null) {
            renderEditPage(res, book, true)
        } else {
            res.redirect('/')
        }
    }
})

bookRouter.delete('/:id', async(req, res) => {
    try {
        await Books.deleteOne({ _id: req.params.id });
        res.redirect('/books');
        console.log('delete successfully');
    } catch (error) {
        console.log(errr);
        res.redirect(`/books/${req.params.id}`);
    }
})





// function

async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors,
            book
        };
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Book';
            } else {
                params.errorMessage = 'Error Creating Book';
            }
        } 
        res.render(`books/${form}`, params);
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
