module.exports = {
  HTML:function(title, list, body, control, loginStatusUI =`
  <a href='/auth/login'>login</a> | <a href="/auth/register">Register</a>`){
    return `
    <!doctype html>
    <html>
    <head>
      <title>Board - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
    ${loginStatusUI}
    <h1><a href="/">Notice board</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(filelist){
    let list = '<ul>';
    let i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/topic/${filelist[i].id}">${filelist[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }
}
