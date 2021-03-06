var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db'
});
const error = require('./error');

var indexRouter = require('./routes/index');
const bookRouter = require('./routes/routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// static file
app.use(express.static('public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully');
//   } catch(err) {
//     console.error("Unable to connect to the database: ", err);
//   }
// })();



app.use('/', indexRouter);
// app.use('/', () =>  {
//   throw Error('whoops');
// })
app.use('/books', bookRouter);

// error handler
app.use(error.fourohfour);
app.use(error.generalError);

// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
