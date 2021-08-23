const express = require('express');
const app = express();
const compression = require('compression');
const fs = require('fs');
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('connect-flash')
const port = 3000;

const authData = {
  email: 'test@test.com',
  password: 'test',
  nickname: 'Jackson'
}

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

const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user.email);
})

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  done(null, authData);
})

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function (username, password, done) {
    console.log('LocalStrategy', username, password);
    if(username !== authData.email) {
      console.log(1)
      return done(null, false, {
        message: 'Incorrect email'
      })
    } else if(password !== authData.password) {
      console.log(2)
      return done(null, false, {
        message: 'Incorrect password'
      })
    } else {
      console.log(3)
      return done(null, authData);
    }
  }
))

app.post('/auth/login_process',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash:true
  }))

app.get('*', (request, response, next) => {
  fs.readdir('./data', (error, filelist) => {
    request.list = filelist;
    next();
  })
})

const topicRouter = require('./router/topic');
const indexRouter = require('./router/index');
const authRouter = require('./router/auth');

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
  console.log(`Example app listening at http://localhost:${port}`)
})
