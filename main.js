const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const cookie = require('cookie');

function auth(request, response){
  let isLogin = false;
  let cookies = {};
  if(request.headers.cookie) {
    cookies = cookie.parse(request.headers.cookie)
  }
  if(cookies.email === 'test@test.com' && cookies.password === 'test'){
    isLogin = true;
  }
  return isLogin;  
}

function makeLoginStatusUI(request, response){
  const isLogin = auth(request, response);
  let loginStatusUI = `<a href='/login'>login</a>`;
  if(isLogin){
    loginStatusUI = `<a href='/logout_process'>logout</a>`
  }
  return loginStatusUI;
}

const app = http.createServer(function(request,response){
  console.log('---catch request---')
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;
  if(pathname === '/'){
    if(queryData.id === undefined){
      fs.readdir('./data', function(error, filelist){
        const title = 'Welcome';
        const description = 'Hello, Node.js';
        const list = template.list(filelist);
        const html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`,
          makeLoginStatusUI(request, response)
        )
        response.writeHead(200);
        response.end(html);
      })
    } else {
      fs.readdir('./data', function(error, filelist){
        const filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          const title = queryData.id;
          const sanitizedTitle = sanitizeHtml(title);
          const sanitizedDescription = sanitizeHtml(description, {
            allowedTags:['h1']
          })
          const list = template.list(filelist);
          const html = template.HTML(sanitizedTitle, list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            ` <a href="/create">create</a>
              <a href="/update?id=${sanitizedTitle}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
              </form>`,
              makeLoginStatusUI(request, response)
          );
          response.writeHead(200);
          response.end(html);
        })
      })
    }
  } else if(pathname === '/create'){
    if(auth(request, response) === false) {
      response.end('Login required!');
      return false;
    }
    fs.readdir('./data', function(error, filelist){
      const title = 'WEB - create';
      const list = template.list(filelist);
      const html = template.HTML(title, list, `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, '', makeLoginStatusUI(request, response))
      response.writeHead(200);
      response.end(html);
    })
  } else if(pathname === '/create_process'){
    if(auth(request, response) === false) {
      response.end('Login required!');
      return false;
    }
    let body = '';
    request.on('data', function(data){
        body = body + data;
    })
    request.on('end', function(){
      const post = qs.parse(body);
      const title = post.title;
      const description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      })
    })
  } else if(pathname === '/update'){
    if(auth(request, response) === false) {
      response.end('Login required!');
      return false;
    }
    fs.readdir('./data', function(error, filelist){
      const filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        const title = queryData.id;
        const list = template.list(filelist);
        const html = template.HTML(title, list,
          `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`,
          makeLoginStatusUI(request, response)
        );
        response.writeHead(200);
        response.end(html);
      })
    })
  } else if(pathname === '/update_process'){
    if(auth(request, response) === false) {
      response.end('Login required!');
      return false;
    }
    let body = '';
    request.on('data', function(data){
      body = body + data;
    })
    request.on('end', function(){
      const post = qs.parse(body);
      const id = post.id;
      const title = post.title;
      const description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(error){
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        })
      })
    })
  } else if(pathname === '/delete_process'){
    if(auth(request, response) === false) {
      response.end('Login required!');
      return false;
    }
    let body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      const post = qs.parse(body);
      const id = post.id;
      const filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function(error){
        response.writeHead(302, {Location: `/`});
        response.end();
      })
    })
  } else if(pathname === '/login') {
    fs.readdir('./data', function(error, filelist){
    const title = 'Login';
    const list = template.list(filelist);
    const html = template.HTML(title, list,
      `
      <form action="login_process" method="post"> 
        <p><input type="text" name="email" palceholder="email"></p>
        <p><input type="password" name="password" palceholder="password"></p>
        <p><input type="submit"></p>
      </form>`,
      `<a href="/create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  })
  } else if(pathname === '/login_process') {
    let body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      const post = qs.parse(body);
      if(post.email === 'test@test.com' && post.password === 'test') {
        response.writeHead(302, {
          'Set-Cookie':[
            `email=${post.email}`,
            `password=${post.password}`,
          ],
          Location: '/'
        })
        response.end();
      } else {
        response.end('Login Failed');
      }
    })
  } else if(pathname === '/logout_process') {
    let body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      const post = qs.parse(body);
        response.writeHead(302, {
          'Set-Cookie':[
            `email=; Max_Age = 0`,
            `password=; Max_age = 0`,
          ],
          Location: '/'
        })
        response.end();
    })
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);
