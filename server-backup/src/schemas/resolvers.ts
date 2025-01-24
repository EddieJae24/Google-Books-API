import { Book, User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js'; 

// Define interfaces for the arguments
interface AddUserArgs {
  input:{
    username: string;
    email: string;
    password: string;
    savedBooks: [string];
  }
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface UserArgs {
  username: string;
}

interface BookArgs {
  bookId: string;
}

interface AddBookArgs {
  input:{
    title: string
    authors: [string]
    description: string
    bookId: string
    image: string
    link: string
    
  }
}


const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },
    user: async (_parent: any, { username }: UserArgs) => {
      return User.findOne({ username }).populate('savedBooks');
    },
    books: async () => {
      return await Book.find().sort({ createdAt: -1 });
    },
    book: async (_parent: any, { bookId }: BookArgs) => {
      return await Book.findOne({ _id: bookId });
    },
    // Query to get the authenticated user's information
    // The 'me' query relies on the context to check if the user is authenticated
    me: async (_parent: any, _args: any, context: any) => {
      // If the user is authenticated, find and return the user's information along with their books
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      // If the user is not authenticated, throw an AuthenticationError
      throw new AuthenticationError('Could not authenticate user.');
    },
  },
  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      // Create a new user with the provided username, email, and password
      const user = await User.create({ ...input });
    
      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);
    
      // Return the token and the user
      return { token, user };
    },
    
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      // Find a user with the provided email
      const user = await User.findOne({ email });
    
      // If no user is found, throw an AuthenticationError
      if (!user) {
        throw new AuthenticationError('Could not authenticate user.');
      }
    
      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);
    
      // If the password is incorrect, throw an AuthenticationError
      if (!correctPw) {
        throw new AuthenticationError('Could not authenticate user.');
      }
    
      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);
    
      // Return the token and the user
      return { token, user };
    },

    addBook: async (_parent: any, { input }: AddBookArgs, context: any) => {
      if (context.user) {
        const book = await Book.create({ ...input });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book._id } }
        );

        return book;
      }
      throw new AuthenticationError ('You need to be logged in!');
    },
    
    removeBook: async (_parent: unknown, { bookId }: BookArgs, context: any): Promise<UserArgs | null> => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } }, // Use bookId field for filtering
          { new: true }
        ).populate('savedBooks'); // Ensure populated data is returned
        if (!updatedUser) {
          throw new Error("Failed to remove book.");
        }
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    
},
};

export default resolvers;
