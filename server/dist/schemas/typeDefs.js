const typeDefs = `#graphql
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
  }

  type Book {
    _id: ID
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }


  input BookSearchInput {
    title: String
    authors: [String]
  }



  input UserInput {
    username: String!
    email: String!
    password: String!
    savedBooks: [BookInput]
  }

  input BookInput {
    authors: [String]!
    description: String
    bookId: String
    image: String
    link: String
    title: String!
  }
  
  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    books: [Book]!
    book(bookId: ID!): Book
    me: User
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    addBook(input: BookInput!): Book
    removeBook(bookId: ID!): User
    
  }
`;
export default typeDefs;
