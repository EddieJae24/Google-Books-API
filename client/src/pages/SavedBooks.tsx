import { useQuery, useMutation } from "@apollo/client";
import { Navigate, useParams } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import type { Book } from "../interfaces/Book"; // Import the Book interface
import { QUERY_ME, QUERY_USER } from "../utils/queries"; // GraphQL query to fetch user data
import { REMOVE_BOOK } from "../utils/mutations"; // GraphQL mutation to remove a book
import Auth from "../utils/auth";


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

  const userData = data?.me || data?.user || {}; // Get the user data from the query


  if (Auth.loggedIn() && Auth.getUser().data.id === userData._id) {
    return <Navigate to="/me" />;
  }

  // Handle book deletion
  const handleDeleteBook = async (bookId: string) => {
    try {
    ;
       await removeBook({
        variables: { bookId },
        update(cache){
          const { me } = cache.readQuery<{ me: any }>({ query: QUERY_ME })!;
        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: {
              ...me,
              savedBooks: me.savedBooks.filter((book: Book) => book.bookId !== bookId),
            },
          },
        });
        } // Pass the bookId as a variable to the mutation
      });
      
      
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





