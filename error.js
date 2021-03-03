const fourohfour = (req, res, next) => {
  console.log("Handling 404 error");
  const err = new Error("err")
  err.status = 404;
  err.message = 'Oops, page not found. Looks like that route does not exist.';
  next(err);
}

const generalError = (err, req, res, next) => {
  const status = err.status ? err.status : 500;
  if(err) {
    console.log(err.message);
    console.log(status);
  }
  if(status === 404) {
    console.log(err.message);
    res.render('error', {error: err, status});
  } else {
    err.message = "Oops! something wrong with our server :(";
    res.render('error', {error: err, status});
  }
}

module.exports = {fourohfour, generalError};