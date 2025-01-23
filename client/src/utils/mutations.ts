
import {  gql } from "@apollo/client";

// Mutation to create a user
export const ADD_USER = gql`
    mutation AddUser($input: UserInput!) {
      addUser(input: $input) {
        token
        user {
          _id
          username
          email
          password
          
        }
      }
    }
  `;

// Mutation to log in a user
export const  LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          _id
          username
        }
      }
    }
  `;

// Mutation to save a book for a logged-in user
export const ADD_BOOK = gql`
    mutation addBook($input: BookInput!) {
      addBook(input: $input) {
        # _id
        # username
      
          bookId
          title
          authors
          description
          image
          link
        
      }
    }
  `;

// Mutation to remove a saved book for a logged-in user
export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!) {
      removeBook(bookId: $bookId) {
        success
        bookId
          
      }
    }
  `;

// Search Google Books API (unchanged since it's still a REST API)
export const searchGoogleBooks = (query: string) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};



