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
}

// BOOKS GET ROUTE
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('books/index', { books, title: "Books"});
}))

// NEW BOOK GET ROUTE
router.get('/new', asyncHandler(async (req, res) => {
  res.render('books/new-book', {title: "Create new book"});
}))

// POST ROUTE FOR CREATING BOOKS
router.post('/new', asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  res.redirect('/')
}))

// // GET INDIVIDUAL BOOK
// router.get('/:id', asyncHandler(async (req, res) => {
//   res.render('update-book')
// }))

// router.post('/:id', asyncHandler(async (req, res) => {
//   res.redirect('/books');
// }))

// router.post('/:id/delete', asyncHandler(async (req, res) => {
//   res.redirect('/books')
// }))

module.exports = router;
