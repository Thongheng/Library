import mongoose from "mongoose";
import path from "path";
const coverImage = 'uploads/bookCovers';

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    cover: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
});

BookSchema.virtual('coverImage').get(function() {
    if(this.cover != null) {
        return path.join('/', coverImage, this.cover)
    }
})

const Books = mongoose.model('Books', BookSchema);
export { Books, coverImage };
