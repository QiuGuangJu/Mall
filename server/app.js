var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.listen("3000")
let arr = []
for (let i = 0; i < 1000; i++) {
  arr.push(`num${Math.random()}`)
}

const goods = require('./routes/goods')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cookieSession({
  extended: false,
  keys: arr,
  maxAge: 1000 * 60
}));
app.use(express.static(path.join(__dirname, 'public')));

// 未登录 拦截
app.use((req, res, next) => {
  let userId = req.cookies.userId
  if (userId) {
    next()
  } else {
    if (req.path === '/users/login' || req.path === 'users/logout' || req.path === '/goods') {
      next()
    } else {
      res.json({
        status: 1,
        msg: '当前用户未登录',
        result: ''
      })
    }
  }
})

app.use('/', indexRouter);
app.use('/users', users);
app.use('/goods', goods);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
