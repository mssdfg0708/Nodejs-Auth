  module.exports = function(app){
    const authData = {
        email: 'test@test.com',
        password: 'test',
        nickname: 'Jackson'
    }  

    const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
    done(null, user.email);
    })

    passport.deserializeUser(function(id, done) {
    done(null, authData);
    })

    passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function (username, password, done) {
        if(username !== authData.email) {
        console.log('email error')
        return done(null, false, {
            message: 'Incorrect email'
        })
        } else if(password !== authData.password) {
        console.log('password error')
        return done(null, false, {
            message: 'Incorrect password'
        })
        } else {
        console.log('Login success')
        return done(null, authData);
        }
    }
    ))
    return passport;
}
