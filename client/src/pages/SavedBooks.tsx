import { useQuery, useMutation } from "@apollo/client";
import { Navigate, useParams } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import type { Book } from "../interfaces/Book"; // Import the Book interface
import { QUERY_ME, QUERY_USER } from "../utils/queries"; // GraphQL query to fetch user data
import { REMOVE_BOOK } from "../utils/mutations"; // GraphQL mutation to remove a book
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
  const { username: userParam } = useParams(); // Get the username from the URL
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  }); // Fetch logged-in user's data
  const [removeBook] = useMutation(REMOVE_BOOK); // Mutation to remove a book

  // Handle the case where user data is not yet loaded
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  const userData = data?.me || {};


  if (Auth.loggedIn() && Auth.getUser().data.id === userData._id) {
    return <Navigate to="/me" />;
  }

  // Handle book deletion
  const handleDeleteBook = async (bookId: string) => {
    try {
       await removeBook({
        variables: { bookId }, // Pass the bookId as a variable to the mutation
      });

      // Update localStorage to remove the book ID
      removeBookId(bookId);

      // Optionally: Display a success message or update the UI
      alert("Book removed successfully!");
    } catch (err) {
      console.error("Error removing book:", err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks?.map((book:Book) => (
            <Col md="4" key={book.bookId}>
              <Card border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors.join(", ")}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;





// import { useState, useEffect } from 'react';
// import { Container, Card, Button, Row, Col } from 'react-bootstrap';

// import { getMe, deleteBook } from '../utils/API';
// import Auth from '../utils/auth';
// import { removeBookId } from '../utils/localStorage';
// import type { User } from '../interfaces/User';

// const SavedBooks = () => {
//   const [userData, setUserData] = useState<User>({
//     username: '',
//     email: '',
//     password: '',
//     savedBooks: [],
//   });

//   // use this to determine if `useEffect()` hook needs to run again
//   const userDataLength = Object.keys(userData).length;

//   useEffect(() => {
//     const getUserData = async () => {
//       try {
//         const token = Auth.loggedIn() ? Auth.getToken() : null;

//         if (!token) {
//           return false;
//         }

//         const response = await getMe(token);

//         if (!response.ok) {
//           throw new Error('something went wrong!');
//         }

//         const user = await response.json();
//         setUserData(user);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     getUserData();
//   }, [userDataLength]);

//   // create function that accepts the book's mongo _id value as param and deletes the book from the database
//   const handleDeleteBook = async (bookId: string) => {
//     const token = Auth.loggedIn() ? Auth.getToken() : null;

//     if (!token) {
//       return false;
//     }

//     try {
//       const response = await deleteBook(bookId, token);

//       if (!response.ok) {
//         throw new Error('something went wrong!');
//       }

//       const updatedUser = await response.json();
//       setUserData(updatedUser);
//       // upon success, remove book's id from localStorage
//       removeBookId(bookId);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // if data isn't here yet, say so
//   if (!userDataLength) {
//     return <h2>LOADING...</h2>;
//   }

//   return (
//     <>
//       <div className='text-light bg-dark p-5'>
//         <Container>
//           {userData.username ? (
//             <h1>Viewing {userData.username}'s saved books!</h1>
//           ) : (
//             <h1>Viewing saved books!</h1>
//           )}
//         </Container>
//       </div>
//       <Container>
//         <h2 className='pt-5'>
//           {userData.savedBooks.length
//             ? `Viewing ${userData.savedBooks.length} saved ${
//                 userData.savedBooks.length === 1 ? 'book' : 'books'
//               }:`
//             : 'You have no saved books!'}
//         </h2>
//         <Row>
//           {userData.savedBooks.map((book) => {
//             return (
//               <Col md='4'>
//                 <Card key={book.bookId} border='dark'>
//                   {book.image ? (
//                     <Card.Img
//                       src={book.image}
//                       alt={`The cover for ${book.title}`}
//                       variant='top'
//                     />
//                   ) : null}
//                   <Card.Body>
//                     <Card.Title>{book.title}</Card.Title>
//                     <p className='small'>Authors: {book.authors}</p>
//                     <Card.Text>{book.description}</Card.Text>
//                     <Button
//                       className='btn-block btn-danger'
//                       onClick={() => handleDeleteBook(book.bookId)}
//                     >
//                       Delete this Book!
//                     </Button>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             );
//           })}
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default SavedBooks;
