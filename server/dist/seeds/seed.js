import db from '../config/connection.js';
import { User, Book } from '../models/index.js';
import cleanDB from './cleanDB.js';
import userData from './userData.json' with { type: 'json' };
import bookData from './bookData.json' with { type: 'json' };
// randomly assign a user to each book before seeding the database
const seedDatabase = async () => {
    try {
        await db();
        await cleanDB();
        await Book.insertMany(bookData);
        await User.create(userData);
        console.log('Seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
seedDatabase();
