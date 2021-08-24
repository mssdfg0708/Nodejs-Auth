const express = require('express')
const router = express.Router()
const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template.js');
const shortid = require('shortid');
const db = require('../lib/db.js');
const bcrypt = require('bcrypt');

module.exports = function(passport){
  //route '/login'
  router.get('/login', (request, response) => {
    console.log('access : login page');
    const flashMsg = request.flash();
    let feedback = '';
    if (flashMsg.error)
      feedback = flashMsg.error[0];
    const title = 'WEB - login';
    const list = template.list(request.list);
    const html = template.HTML(title, list, `
      <div>${feedback}</div>
      <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p>
          <input type="submit" value="login">
        </p>
      </form>
    `, '');
    response.send(html);
  })

  //route '/register'
  router.get('/register', (request, response) => {
    console.log('access : register page');
    const flashMsg = request.flash();
    let feedback = '';
    if (flashMsg.error)
      feedback = flashMsg.error[0];
    const title = 'WEB - register';
    const list = template.list(request.list);
    const html = template.HTML(title, list, `
      <div>${feedback}</div>
      <form action="/auth/register_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="password" name="checkPassword" placeholder="check password"></p>
        <p><input type="text" name="displayName" placeholder="display name"></p>
        <p>
          <input type="submit" value="register">
        </p>
      </form>
    `, '');
    response.send(html);
  })

  //route 'register_process'
  router.post('/register_process', function (request, response) {
    const post = request.body;
    const email = post.email;
    const password = post.password;
    const checkPassword = post.checkPassword;
    const displayName = post.displayName;
    if (!email) {
      request.flash('error', 'Write email please');
      response.redirect('/auth/register');
    }
    const overlap = db.get('users').find({
      email: email
    }).value();
    console.log(overlap);
    if (overlap){
      request.flash('error', 'This email is alreday used');
      response.redirect('/auth/register');
    }
    else if (!password) {
      request.flash('error', 'Write password please');
      response.redirect('/auth/register');
    }
    else if (!displayName) {
      request.flash('error', 'Write display name please');
      response.redirect('/auth/register');
    }
    else if (password !== checkPassword) {
      request.flash('error', 'Check your password');
      response.redirect('/auth/register');
    }
    else {
      bcrypt.hash(password, 10, function (err, hash) {
        const user = {
          id: shortid.generate(),
          email: email,
          password: hash,
          displayName: displayName
        }
        db.get('users').push(user).write();
        request.login(user, function(err){
          console.log('redirect');
          return response.redirect('/');
        })
      })
    }
    /*
    else {
      db.get('users').push({
        id: shortid.generate(),
        email: email,
        password: password,
        displayName: displayName
      }).write();
      response.redirect('/');
    }
    */
  })

  //route 'login_process'
  router.post('/login_process',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash:true
    })
  )

  //route '/logout'
  router.get('/logout', (request, response) => {
    console.log('access : logout page')
    request.logout();
    request.session.save(function(){
      response.redirect('/');
    })
  })
  return router;
}
