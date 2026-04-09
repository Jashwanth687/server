var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
var mongoose = require('mongoose');

var connectionString = process.env.MONGO_CON;
mongoose.connect(connectionString);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var resourceRouter = require('./routes/resource');
var Costume = require('./models/costume');

var app = express();

async function recreateDB() {
  await Costume.deleteMany();

  let instance1 = new Costume({
    costume_type: 'Pirate',
    size: 'M',
    cost: 39.99
  });

  let instance2 = new Costume({
    costume_type: 'Wizard',
    size: 'L',
    cost: 49.99
  });

  let instance3 = new Costume({
    costume_type: 'Astronaut',
    size: 'S',
    cost: 59.99
  });

  await instance1.save();
  console.log('First object saved');
  await instance2.save();
  console.log('Second object saved');
  await instance3.save();
  console.log('Third object saved');
}

db.once('open', function () {
  console.log('Connection to DB succeeded');
  recreateDB().catch(function (err) {
    console.log(err);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/resource', resourceRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
