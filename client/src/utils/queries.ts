import { gql } from '@apollo/client';

// Query to fetch a specific user by username
export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
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

// Query to fetch all books saved by all users (if applicable)
export const QUERY_BOOKS = gql`
  query getBooks {
    books {
      bookId
      title
      authors
      description
      image
      link
    }
  }
`;

// Query to fetch a single book by its ID (if applicable in the schema)
export const QUERY_SINGLE_BOOK = gql`
  query getSingleBook($bookId: String!) {
    book(bookId: $bookId) {
      bookId
      title
      authors
      description
      image
      link
    }
  }
`;

// Query to fetch the logged-in user's information
export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
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



