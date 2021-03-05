const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Op } = require("sequelize");
const pageSize = 5;
let pages;
let totalBooks;

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

// pagination function
const paginate = (query, { page, pageSize }) => {
  const offset = page * pageSize;
  const limit = pageSize;

  return {
    ...query,
    offset,
    limit,
  };
};

// BOOKS GET ROUTE
router.get('/pages/:id', asyncHandler(async (req, res) => {
  const page = req.params.id - 1;
  const current = req.params.id;
  totalBooks = await Book.findAll();
  const route = `/books/pages/${current}`
  const books = await Book.findAll(
    paginate (
      {
        where: {}
      },
      {page, pageSize}
    )
  );
  pages = Math.ceil(totalBooks.length / pageSize)
  res.render('books/index', 
  { books, 
    title: "Books", 
    current,
    pages,
    route
  });
}));

// SEARCH POST ROUTE
router.post('/pages/:id', (req, res) => {
  const query = req.body.search
  res.redirect('/books/search?q=' + query)
})

router.get('/search', asyncHandler(async (req, res) => {
  const query = req.query.q;
  console.log(query);
  const books = await Book.findAll( 
      {
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: '%' + query + '%'
              }
            },
            {
              author: {
                [Op.like]: '%' + query + '%'
              }
            },
            {
              genre: {
                [Op.like]: '%' + query + '%'
              }
            },
            {
              year: {
                [Op.like]: '%' + query + '%'
              }
            },
          ]
        }
      }
  )
  console.log(books);
  res.render('books/search', {title: "Search Result", books})
}))

// SEARCH POST ROUTE FROM SEARCH
router.post('/search', (req, res) => {
  const query = req.body.search
  res.redirect('/books/search?q=' + query);
})

// NEW BOOK GET ROUTE
router.get('/new', asyncHandler(async (req, res) => {
  res.render('books/new-book', {title: "Create new book", book: {}});
}));

// POST ROUTE FOR CREATING BOOKS
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body)
    res.redirect('/books/pages/1');
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
      res.redirect('/books/pages/1');
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
    res.redirect('/books/pages/1');
  } else {
    res.sendStatus(404);
  }
}))

module.exports = router;

