module.exports = function(passport){
  const express = require('express')
  const router = express.Router()
  const path = require('path');
  const fs = require('fs');
  const sanitizeHtml = require('sanitize-html');
  const template = require('../lib/template.js');

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
