const db = require('./db');
const bcrypt = require('bcrypt');

module.exports = function(app){
    const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        console.log('serializeUser', user);
        done(null, user.id);
    })

    passport.deserializeUser(function(id, done) {
        const user = db.get('users').find({id:id}).value();
        done(null, user);
    })

    passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, done) {
        console.log('LocalStrategy', email, password);
        const user = db.get('users').find({
            email: email
        }).value();
        if (user) {
            bcrypt.compare(password, user.password, function(err,result){
                if (result) {
                    return done(null, user)
                }
                else {
                    return done(null, false, {message: 'Password is not correct'})
                }
            })
        }
        else {
            return done(null, false, {message: 'email is not correct'})
        }
    }
    ))
    return passport;
}
