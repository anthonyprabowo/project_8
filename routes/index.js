var express = require('express');
var router = express.Router();
var Book = require('../models').Book;

console.log(Book);

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.redirect('/books/pages/1')
});

module.exports = router;
