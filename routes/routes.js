const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

// async handler function to wrap each routes
const asyncHandler = (cb) => {
  return async(req, res,next) => {
    try {
      await cb(req,res,next);
    } catch(error) {
      next(error);
    }
  }
};

// BOOKS GET ROUTE
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('books/index', { books, title: "Books"});
}));

// NEW BOOK GET ROUTE
router.get('/new', asyncHandler(async (req, res) => {
  res.render('books/new-book', {title: "Create new book", book: {}});
}));

// POST ROUTE FOR CREATING BOOKS
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body)
    res.redirect('/books');
  } catch(err) {
    if(err.name === "SequelizeValidationError"){
      book = await Book.build(req.body);
      res.render('books/new-book', {title: "Create new book", errors: err.errors, book })
    } else {
      throw err;
    }
  }
  
}));

// GET INDIVIDUAL BOOK
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('books/update-book', {title: "Update Book", book})
  } else {
    res.render('books/page-not-found');
  }
}));

// UPDATE A BOOK
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book){
      await book.update(req.body);
      res.redirect('/books');
    } else {
      res.render('books/page-not-found');
    }
  } catch(err) {
    if(err.name === "SequelizeValidationError"){
      book = await Book.build(req.body);
      book.id = req.params.id; // don't forget this or it will lose binding
      res.render('books/update-book', {title: "Update Book", errors: err.errors, book })
    } else {
      throw err;
    }
  }
  
}));

router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.sendStatus(404);
  }
}))

module.exports = router;

