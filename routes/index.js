var express = require('express');
var router = express.Router();
const {Book} = require('../models');

// This code can be used to test the Book model and communication with the database, by displaying a page in a JSON format

/*
router.get('/', async (req, res, next) => {
 // res.render('index', { title: 'Express' });
 try {
 const books = await Book.findAll();
 console.log(books.map (book => book.toJSON() ));
 res.json({books});
} catch (err) {
 res.render('error', {error : err});
};
});
*/


// Redirect the home route to the /books route
router.get('/', (req, res, next) => {
  res.redirect('/books')
}); 

module.exports = router;