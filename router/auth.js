const express = require('express')
const router = express.Router()
const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template.js');

const authData = {
  email: 'test@test.com',
  password: 'test',
  nickname: 'Jackson'
}


//route '/login'
router.get('/login', (request, response) => {
  console.log('access : login page');
  const title = 'WEB - login';
  const list = template.list(request.list);
  const html = template.HTML(title, list, `
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

//route '/login_process'
router.post('/login_process', (request, response) => {
  console.log('access : login_process');
  const post = request.body;
  const email = post.email;
  const password = post.password;
  console.log(email, password)
  if (email === authData.email && password === authData.password) {
    request.session.isLogin = true;
    request.session.nickname = authData.nickname;
    request.session.save(function(){
      response.redirect('/');
    })
  } else {
    response.send('Login Failed')
  }
})

//route '/logout'
router.get('/logout', (request, response) => {
  console.log('access : logout page')
  request.session.destroy((err) => {
    if(err) {
      throw err
    }
    else {
      response.redirect('/')
    }
  })
})

module.exports = router;
