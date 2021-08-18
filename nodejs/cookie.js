const http = require('http');
const cookie = require('cookie');

http.createServer( (request, response) => {
    let cookieList = {};
    if (request.headers.cookie !== undefined) {
        cookieList = cookie.parse(request.headers.cookie);
    }
    response.writeHead(200, {
        'Set-Cookie':[
            'yummy_cookie = choco',
            'tasty_cookie = strawberry',
            `Permanent_cookie = permanent; Max-Age=${60*60*24}`,
            'Secure_cookie = secure; Secure',
            'HttpOnly_cookie= HttpOnly; HttpOnly',
            'Path_coookie = Path; Path=/test']
    })
    response.end(`Cookie! \n 
yummy_cookie : ${cookieList.yummy_cookie} \n  
tasty_cookie : ${cookieList.tasty_cookie}`);
}).listen(3000);
