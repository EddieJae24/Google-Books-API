import { Schema, model } from 'mongoose';
// Define the schema for the Thought document
const bookSchema = new Schema({
    authors: [
        {
            type: String,
            required: true,
        },
    ],
    description: {
        type: String,
    },
    bookId: {
        type: String,
    },
    image: {
        type: String,
    },
    link: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
});
const Book = model('Book', bookSchema);
export default Book;
