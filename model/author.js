import mongoose from "mongoose";
import { Books } from "./book.js";

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

// Use pre('deleteOne', ...) middleware
authorSchema.pre('deleteOne', async function(next) {
    const docToDelete = this.getQuery()._id; // Get the ID of the document to delete
    try {
        const books = await Books.find({ author: docToDelete });
        if (books.length > 0) {
            next(new Error('This author is associated with books. Cannot delete.'));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

const Author = mongoose.model('Author', authorSchema);
export { Author };
