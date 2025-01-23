
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



