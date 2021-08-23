const express = require('express')
const parseurl = require('parseurl')
const session = require('express-session')
const fileStore = require('session-file-store')(session)

const app = express()

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new fileStore()
}))

app.use(function (req, res, next){
    if (!req.session.views) {
        req.session.views = {}
    }

    const pathname = parseurl(req).pathname

    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1

    next()
})

app.get('/test', function (req, res, next) {
    if(req.session.num === undefined) {
        req.session.num = 1
    } else {
        req.session.num = req.session.num + 1
    }
    console.log(req.session)
    res.send('You view this page ' + req.session.num + ' times')
})

app.get('/foo', function (req, res, next) {
    res.send('You view this page ' + req.session.views['/foo'] + ' times')
})

app.get('/bar', function (req, res, next) {
    res.send('You view this page ' + req.session.views['/bar'] + ' times')
})

app.listen(3000, function() {
    console.log('port 3000')
})
