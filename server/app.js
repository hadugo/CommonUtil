
// ===================================================================
// 파일명 : \app.js
// ===================================================================
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require('cors'); // CORS 패키지 가져오기


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const getCommonRouter = require('./routes/getCommonRouter');


var app = express();
app.use(cors()); // 기본 설정으로 CORS 허용

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

/* ------------------------------------------ *
 * controllers 모든 파일을 읽어와 Routing하는 경우
 * ------------------------------------------ *
const controllersDir = path.join(__dirname, 'controllers');
fs.readdirSync(controllersDir).forEach(file => {
  const controller = require(path.join(controllersDir, file));
  const routePath = controller.routePath || `/${path.basename(file, '.js').toLowerCase()}`;
  const router = getCommonRouter(controller);
  app.use(routePath, router);
});
 * ------------------------------------------ */


/* ------------------------------------------ *
 * routes/routerList.js 를 이용하는 경우
 * ------------------------------------------ **/
const routerList = require('./routes/routerList'); // routerList.js 가져오기
routerList.forEach(route => {
    const controllerPath = route.controllerPath;
    const router = getCommonRouter(controllerPath); // getCommonRouter를 사용하여 라우터 생성
    app.use(route.url, router); // 라우터를 Express 애플리케이션에 추가
});
/* ------------------------------------------ */

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
