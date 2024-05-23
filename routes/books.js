import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Books, coverImage } from "../model/book.js";
import { Author } from "../model/author.js";

const bookRouter = express.Router();

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const uploadPath = path.join('public', coverImage);

// Ensure the upload directory exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        const isValid = imageMimeTypes.includes(file.mimetype);
        callback(null, isValid);
    }
});

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
bookRouter.post('/', upload.single('cover'), async (req, res) => {
    const { title, author, publishDate, pageCount, description } = req.body;
    const cover = req.file ? req.file.filename : null;

    const book = new Books({
        title,
        author,
        publishDate: new Date(publishDate),
        pageCount,
        cover,
        description
    });

    try {
        const newBook = await book.save();
        res.redirect('/books');
    } catch (error) {
        if (book.cover != null) {
            removeBookCover(book.cover)
        }
        renderNewPage(res, book, true);
    }
});

async function removeBookCover(fileName) {
    const filePath = path.join(uploadPath, fileName); // Construct the full path
    try {
        await fs.promises.access(filePath);
        await fs.promises.unlink(filePath);
        console.log(`Successfully removed book cover: ${fileName}`);

    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log(`File not found: ${fileName}`);
        } else {
            console.error(`Error removing book cover: ${fileName}`, err);
        }
    }
}
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


export { bookRouter };
