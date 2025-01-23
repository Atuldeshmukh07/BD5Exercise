const express = require("express");
const { author } = require("./models/author.js");
const { sequelize } = require("./lib/index.js");
const { book } = require("./models/book.js");
const app = express();

app.use(express.json());

const books = [
  {
    title: "Harry Potter and the Philosopher's Stone",
    genre: "Fantasy",
    publicationYear: 1997,
  },
  { title: "A Game of Thrones", genre: "Fantasy", publicationYear: 1996 },
  { title: "The Hobbit", genre: "Fantasy", publicationYear: 1937 },
];

const authors = [{ name: "J.K Rowling", birthYear: 1965 }];

app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await book.bulkCreate(books);
    await author.bulkCreate(authors);
    res.status(200).json({ message: "Database seeding successfull." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error seeding the data.", error: error.message });
  }
});

// Fetch all Books.
async function fetchAllBooks() {
  let books = await book.findAll();
  return { books };
}

app.get("/books", async (req, res) => {
  try {
    let response = await fetchAllBooks();

    if (response.books.length === 0) {
      res.status(404).json({ message: "No books found." });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all Authors.
async function fetchAllAuthors() {
  let authors = await author.findAll();
  return { authors };
}

app.get("/authors", async (req, res) => {
  try {
    let response = await fetchAllAuthors();

    if (response.authors.length === 0) {
      res.status(404).json({ message: "No authors found." });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 1: Create New Author.
async function addNewAuthor(newAuthor) {
  let newData = await author.create(newAuthor);
  return { newData };
}

app.post("/authors/new", async (req, res) => {
  try {
    let newAuthor = req.body.newAuthor;
    let response = await addNewAuthor(newAuthor);

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 2: Update Author by ID.
async function updateAuthorById(id, newAuthorData) {
  let authorDetails = await author.findOne({ where: { id } });
  if (!authorDetails) {
    return {};
  }
  authorDetails.set(newAuthorData);
  let updatedAuthor = await authorDetails.save();
  return { message: "Author updated successfully", updatedAuthor };
}

app.post("/authors/update/:id", async (req, res) => {
  try {
    let newAuthorData = req.body;
    let id = parseInt(req.params.id);
    let response = await updateAuthorById(id, newAuthorData);
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
