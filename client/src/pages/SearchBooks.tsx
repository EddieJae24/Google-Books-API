import React, { useState } from "react";
import { searchGoogleBooks } from "../utils/mutations"; // Import searchGoogleBooks function
import {ADD_BOOK } from "../utils/mutations"; // Import addBook mutation
import { useMutation } from "@apollo/client"; // Hook for executing mutations
import Auth from "../utils/auth"; // Utility for handling authentication (if implemented)
import type { Book } from "../interfaces/Book"; // Import Book interface

const SearchBooks = () => {
  const [searchInput, setSearchInput] = useState(""); // For search input
  const [searchedBooks, setSearchedBooks] = useState([]); // For storing search results
  const [addBook] = useMutation(ADD_BOOK);

  // Handle book search
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchInput) return;

    try {
      const response = await searchGoogleBooks(searchInput);
      const { items } = await response.json();

      if (!items) {
        console.error("No items found in Google Books API response.");
        return;
      }

      // Format books for display
      const books = items.map((book: any) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ["Unknown Author"],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description || "No description available.",
        image: book.volumeInfo.imageLinks?.thumbnail || "",
        link: book.volumeInfo.infoLink,
      }));

      setSearchedBooks(books); // Update state with search results
      // Clear search input
      setSearchInput("");
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  // Handle saving a book

  


  const handleSaveBook = async (book: Book) => {
    const token = Auth.getToken(); // Retrieve the user's token

    if (!token) {
      alert("You must be logged in to save books.");
      return;
    }

    try {
      console.log('Saving book data:', addBook);
      const {data} = await addBook({ variables: { input: {...book}}, }); // Save book to user's account
      
      console.log('Book successfully saved:', data?.addBook);
      alert("Book saved successfully!"); // Notify user of success
    }
    catch (err) {
      console.error("Error saving book:", err);
      alert("Error saving book. Please try again.");
    }
  };

  return (
    <div>
      <h1>Search for Books</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for a book"
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {searchedBooks.map((book:Book) => (
          <div key={book.bookId}>
            <h3>{book.title}</h3>
            <p>{book.authors.join(", ")}</p>
            <p>{book.description}</p>
            <img src={book.image} alt={book.title} />
            <a href={book.link} target="_blank" rel="noopener noreferrer">
              View on Google Books
            </a>
            <button onClick={() => handleSaveBook(book)}>Save This Book</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBooks;




