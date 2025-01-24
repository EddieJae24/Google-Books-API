import { Schema, model, Document } from 'mongoose';

// Define an interface for the Thought document
// interface IComment extends Document {
//   commentText: string;
//   createdAt: Date;
// }

interface IBook extends Document {
  authors: string[];
  description: string;
  bookId: string;
  image: string;
  link: string;
  title: string;
}


// Define the schema for the Thought document
const bookSchema = new Schema<IBook>(
  {
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
  },
  
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

const Book = model<IBook>('Book', bookSchema);

export default Book;




