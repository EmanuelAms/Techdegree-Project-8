var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');
const { sequelize } = require('./models');
var app = express();

// Synchronizing the model with the database, and connecting the app to the database. t
(async()=>{
  await sequelize.sync();
 try {
  await sequelize.authenticate();
  console.log('The connection has been established.');
 } catch (error) {
  console.error('The connection has not been established.', error);
 }

}) ();


// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);


// 404 error handler
app.use(function(req, res, next) {
  const err = new Error() ;
  err.status = 404 ;
  err.message = "Sorry! We couldn't find the page you were looking for." ;
  next(err) ;
});


// Global error handler
app.use(function(err, req, res, next) {

  if (err.status === 404) {
    res.status(404).render('page-not-found', {err}) ;
} else {
    err.status = 500 ;
    err.message = 'Sorry! There was an unexpected error on the server.' ;
    res.status(err.status).render('error', {err}) ;
}
  console.log(err.status) ;
  console.log(err.message) ;
});

module.exports = app;