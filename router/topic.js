const express = require('express')
const router = express.Router()
const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template.js');
const auth = require('../lib/authLib.js');
const db = require('../lib/db');
const shortid = require('shortid');


//route '/create'
router.get('/create', (request, response) => {
  if(!auth.checkLogin(request, response)){
    request.flash('error', 'Access Denied');
    response.redirect('/');
    return false;
  }
  console.log('access : create page');
  const title = 'WEB - create';
  const list = template.list(request.list);
  const html = template.HTML(title, list, `
    <form action="/topic/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
`, '',auth.makeLoginUI(request, response));
  response.send(html);
})

//route '/create_process'
router.post('/create_process', (request, response) => {
  console.log('access : create_process');
  const post = request.body;
  const title = post.title;
  const description = post.description;
  // fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
  //   response.redirect(302, `/topic/${title}`);
  // })
  const id = shortid.generate();
  db.get('topics').push({
    id: id,
    title: title,
    description: description,
    user_id: request.user.id
  }).write();
  response.redirect(`/topic/${id}`);
})

//route '/update'
router.get('/update/:pageID', (request, response) => {
  if(!auth.checkLogin(request, response)){
    request.flash('error', 'Access Denied');
    response.redirect('/');
    return false;
  }
  const topic = db.get('topics').find({id:request.params.pageID}).value();
  console.log('access : update page/' + topic.title);
  if (topic.user_id !== request.user.id){
    request.flash('error', 'Access Denied');
    return response.redirect(`/`);
  }
  const title = topic.title;
  const description = topic.description;
  const list = template.list(request.list);
  const html = template.HTML(title, list,
    `
    <form action="/topic/update_process" method="post">
      <input type="hidden" name="id" value="${topic.id}">
      <p><input type="text" name="title" placeholder="title" value="${title}"></p>
      <p>
        <textarea name="description" placeholder="description">${description}</textarea>
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
    `,
    `<a href="/topic/create">create</a> <a href="/topic/update/${topic.id}">update</a>`,
    auth.makeLoginUI(request, response)
  );
  response.send(html);
})

//route '/update_process'
router.post('/update_process', (request, response) => {
  if(!auth.checkLogin(request, response)){
    request.flash('error', 'Access Denied');
    response.redirect('/');
    return false;
  }
  console.log('access : update_process');
  const post = request.body;
  const id = post.id;
  const title = post.title;
  const description = post.description;
  const topic = db.get('topics').find({id:id}).value();
  if(topic.user_id !== request.user.id){
    request.flash('error', 'Access Denied');
    return response.redirect(`/`);
  }
  db.get('topics').find({id:id}).assign({
    title: title,
    description: description
  }).write();
  response.redirect(`/topic/${topic.id}`);
})

//route '/delete_process'
router.post('/delete_process', (request ,response) => {
  if(!auth.checkLogin(request, response)){
    request.flash('error', 'Access Denied');
    response.redirect('/');
    return false;
  }
  console.log('access : delete_process');
  const post = request.body;
  const id = post.id;
  const topic = db.get('topics').find({id:id}).value();
  if(topic.user_id !== request.user.id){
    request.flash('error', 'Access Denied');
    return response.redirect('/');
  }
  db.get('topics').remove({id:id}).write();
  response.redirect('/');
})

//route '/topic/:pageID'
router.get('/:pageID', (request, response, next) => {
  const topic = db.get('topics').find({
    id: request.params.pageID
  }).value();
  console.log('access : page/' +  topic.title);
  const user = db.get('users').find({
    id: topic.user_id
  }).value();
  const sanitizedTitle = sanitizeHtml(topic.title);
  const sanitizedDescription = sanitizeHtml(topic.description, {
    allowedTags:['']
  })
  const list = template.list(request.list);
  const html = template.HTML(sanitizedTitle, list,
    `
    <h2>${sanitizedTitle}</h2>${sanitizedDescription}
    <p>by ${user.displayName}</p>
    `,
    ` 
    <a href="/topic/create">create</a>
    <a href="/topic/update/${topic.id}">update</a>
    <form action="/topic/delete_process" method="post">
      <input type="hidden" name="id" value="${topic.id}">
      <input type="submit" value="delete">
    </form>`,
    auth.makeLoginUI(request, response)
  )
  response.send(html)
})

module.exports = router;
