const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

const app = express(); //express 패키지 호출, app변수 객체 생성. => app객체에 기능 하나씩 연결.

// const routes = require('./routes');
const adminRoutes = require('./routes/admin_api');
const routes = require('./routes/api');

//app.use => 미들웨어 연결
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // css 연결
app.use('/public', express.static(path.join(__dirname, 'public'))); //정적 파일 사용
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'app-ads.txt')));
app.use(expressLayouts);

// 세션 설정
app.use( // request를 통해 세션 접근 가능 ex) req.session
  session({
    // key: "loginData",
    secret: "keyboard cat", // 반드시 필요한 옵션. 세션을 암호화해서 저장함
    resave: false, // 세션 변경되지 않아도 계속 저장됨. 기본값은 true지만 false로 사용 권장
    saveUninitialized: true, // 세션을 초기값이 지정되지 않은 상태에서도 강제로 저장. 모든 방문자에게 고유 식별값 주는 것.
    cookie: {
      maxAge: 36000000
    },
    rolling: true
    // store: new MYSQLStore(connt),
  })
);

app.use(function (req, res, next) {
  if (req.session.user) {
    global.sessionId = req.session.user.id;
  }
  next();
});

// 화면 engine을 ejs로 설정
app.set('layout', 'layout/layout');
app.set("layout extractScripts", true);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.set('views', path.join(__dirname, '/views'));
// app.get("/", (req, res) => { res.render('index.html', {layout:false})  })
// app.get('/', (req, res) => { res.render(__dirname + "/views/ejs/index.ejs", {layout:false}) })
// app.get("/sub01_1", (req, res) => { res.render('userEjs/sub1/sub1_1.ejs'); })
// app.get("/sub01_2", (req, res) => { res.render('userEjs/sub1/sub1_2.ejs'); })
// app.get("/sub01_3", (req, res) => { res.render('userEjs/sub1/sub1_3.ejs'); })
// app.get("/sub01_4", (req, res) => { res.render('userEjs/sub1/sub1_4.ejs'); })
// app.get("/sub02_1", (req, res) => { res.render('userEjs/sub2/sub2_1.ejs'); })
// app.get("/sub02_2", (req, res) => { res.render('userEjs/sub2/sub2_2.ejs'); })
// app.get("/sub04_1", (req, res) => { res.render('userEjs/sub4/sub4_1.ejs'); })
// app.get("/sub5_3_detail", (req, res) => { res.render('userEjs/sub5/sub5_3_detail.ejs'); })

app.set('routes', path.join(__dirname, '/routes'));

app.use('/', routes);
app.use('/admin', adminRoutes);


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
  res.render('error', { layout: false });
});

app.all('*',
  function (req, res) {
    res.render('error', {layout:false});
  });

module.exports = app; //app객체를 모듈로 만듦(bin/www에서 사용된 app모듈)
