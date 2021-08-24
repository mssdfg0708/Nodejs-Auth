const express = require('express');
const app = express();
const compression = require('compression');
const fs = require('fs');
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('connect-flash')
const db = require('./lib/db');
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true,
  //store: new FileStore()
}))
app.use(flash())

const passport = require('./lib/passport')(app)

app.get('*', (request, response, next) => {
  request.list = db.get('topics').value();
  next();
})

const topicRouter = require('./router/topic');
const indexRouter = require('./router/index');
const authRouter = require('./router/auth')(passport);

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

//404 Error
app.use(function (req, res, next) {
  res.status(404);
});

//Error Handler
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
