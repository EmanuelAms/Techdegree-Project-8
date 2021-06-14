var express = require('express');
var router = express.Router();
const {Book} = require('../models');

// Every route is wrapped in "asyncHandler" to accesses the Book model, because of the asynchronous nature of the database
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      next(error);
    }
  }
}


// Route to render the list with all the books
// The books are ordered by author name
router.get('/', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll({ order: [["author", "DESC"]] });
  res.render('index', { books, title: "Books" });
}));

// Route to render the form to create a new book
router.get('/new', (req, res, next) => {
  res.render('books/new-book', { book: {}, title: "New Book" });
});

// Route to render the view of a specific book
// A 500 error page is rendered if the user goes to a book id that doesn't exist
router.get('/:id', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
  res.render('books/update-book', { book, title: book.title });
} else {
  next(error);
}
}));


// Add interactivity to the form to create a new book
// If the title or author are not defined, the sequelize validation error is detected and appropriate messages are displayed on the page
router.post('/new', asyncHandler(async(req, res, next) => {
  let book ;
  try { 
    book = await Book.create(req.body);
    res.redirect('/');
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render('books/new-book', { book, errors: error.errors, title: "New Book" });
    } else {
      throw error;
    }
  }
}));

// Add interactivity to the view of a specific book, to update it
// If the title or author are not defined, the sequelize validation error is detected and appropriate messages are displayed on the page
router.post('/:id', asyncHandler(async(req, res, next) => {
  let book ;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect('/');
    } else {
      next(error);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('books/new-book', { book, errors: error.errors, title: "Edit Book" });
    } else {
      throw error;
    }
  }
}));

// Add interactivity to the view of a specific book, to delete it
router.post('/:id/delete', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect('/');
  } else {
    next(error);
  }
}));

module.exports = router;