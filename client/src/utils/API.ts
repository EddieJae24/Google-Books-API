import { ApolloClient, InMemoryCache, gql } from "@apollo/client";


// Initialize Apollo Client
const client = new ApolloClient({
  uri: "/graphql", // Backend GraphQL endpoint
  cache: new InMemoryCache(),
});

// Query to get logged-in user's info (requires token)
export const getMe = async (token: string) => {
  const GET_ME = gql`
    query Me {
      me {
        _id
        username
        email
        savedBooks {
          bookId
          authors
          title
          description
          image
          link
        }
      }
    }
  `;

  return await client.query({
    query: GET_ME,
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });
};

// Mutation to create a user
export const createUser = async (userData: { username: string; email: string; password: string }) => {
  const ADD_USER = gql`
    mutation AddUser($username: String!, $email: String!, $password: String!) {
      addUser(input: { username: $username, email: $email, password: $password }) {
        token
        user {
          _id
          username
          email
        }
      }
    }
  `;

  return await client.mutate({
    mutation: ADD_USER,
    variables: userData,
  });
};

// Mutation to log in a user
export const loginUser = async (userData: { email: string; password: string }) => {
  const LOGIN_USER = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          _id
          username
        }
      }
    }
  `;

  return await client.mutate({
    mutation: LOGIN_USER,
    variables: userData,
  });
};

// Mutation to save a book for a logged-in user
export const addBook = async (bookData: any, token: string) => {
  const ADD_BOOK = gql`
    mutation addBook($input: BookInput!) {
      addBook(input: $input) {
        _id
        username
        savedBooks {
          bookId
          title
          authors
          description
          image
          link
        }
      }
    }
  `;

  return await client.mutate({
    mutation: ADD_BOOK,
    variables: { input: bookData },
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });
};

// Mutation to remove a saved book for a logged-in user
export const deleteBook = async (bookId: string, token: string) => {
  const REMOVE_BOOK = gql`
    mutation RemoveBook($bookId: String!) {
      removeBook(bookId: $bookId) {
        _id
        username
        savedBooks {
          bookId
          title
        }
      }
    }
  `;

  return await client.mutate({
    mutation: REMOVE_BOOK,
    variables: { bookId },
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });
};

// Search Google Books API (unchanged since it's still a REST API)
export const searchGoogleBooks = (query: string) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};




// import type { User } from '../../../server/src/models/User.js';
// import type { Book } from '../../../server/src/models/Book.js';

// // route to get logged in user's info (needs the token)
// export const getMe = (token: string) => {
//   return fetch('/api/users/me', {
//     headers: {
//       'Content-Type': 'application/json',
//       authorization: `Bearer ${token}`,
//     },
//   });
// };

// export const createUser = (userData: User) => {
//   return fetch('/api/users', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(userData),
//   });
// };

// export const loginUser = (userData: User) => {
//   return fetch('/api/users/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(userData),
//   });
// };

// // save book data for a logged in user
// export const saveBook = (bookData: Book, token: string) => {
//   return fetch('/api/users', {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(bookData),
//   });
// };

// // remove saved book data for a logged in user
// export const deleteBook = (bookId: string, token: string) => {
//   return fetch(`/api/users/books/${bookId}`, {
//     method: 'DELETE',
//     headers: {
//       authorization: `Bearer ${token}`,
//     },
//   });
// };

// // make a search to google books api
// // https://www.googleapis.com/books/v1/volumes?q=harry+potter
// export const searchGoogleBooks = (query: string) => {
//   return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
// };
