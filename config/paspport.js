/**
 * Created by Status O'Brien on 30/06/17.
 */

// config/passport.js

var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// need user model
var User = require('../app/users');

// need auth
var configAuth = require('./auth');

module.exports = function (passport) {

    passport.serializeUser(function(user, done) {
        console.log('serializeUser: ' + user.userId)
        done(null, user.userId);
    });

    passport.deserializeUser(function(id, done) {
        console.log('deserializeUser: ' + id);
        User.findOne(id, function(err, user){
            done(err, user);
        })
    });

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================

    passport.use(new GoogleStrategy({
            clientID : configAuth.googleAuth.clientID,
            clientSecret : configAuth.googleAuth.clientSecret,
            callbackURL : configAuth.googleAuth.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            console.log('made it to function');
            process.nextTick(function () {

                // find the user in the database based on their facebook id
                User.findOne (profile.id, function (err, user) {
                    console.log('made it to find one');
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        console.log('User is now logged in with google as: ' + user.user_name);
                        return done(null, user);
                    }

                    else {
                        // create a new user
                        var newUser = new User();
                        newUser.userId = profile.id;
                        newUser.user_name = profile.displayName;
                        newUser.first_name = profile.name.givenName;
                        newUser.last_name = profile.name.familyName;
                        newUser.accessToken = accessToken;
                        newUser.email = profile.emails[0].value;

                        //insert into the database
                        newUser.save(function (err) {
                            if (err) {
                                console.log(err);
                                return done(null, null); // should redirect us to the login page
                            }

                            return done(null, newUser);
                        })
                    }
                });
            });
        }
    ));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================

    var fbOpts = {
        clientID: 238120290008806,
        clientSecret: 'b5291cbe9d73872bed7743f39d2f3fe1',
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'emails', 'name', 'displayName', 'gender']
    };

    var fbCallback = function (accessToken, refreshToken, profile, done) {
        // asynchronous
        process.nextTick (function () {

            // find the user in the database based on their facebook id
            User.findOne (profile.id, function (err, user) {

                if (err) {
                    return done(err);
                }

                if (user) {
                    console.log('User is now logged in with facebook as: ' + user.user_name);
                    return done(null, user);
                }

                else {
                    // create a new user
                    var newUser = new User();
                    newUser.userId = profile.id;
                    newUser.user_name = profile.displayName;
                    newUser.first_name = profile.name.givenName;
                    newUser.last_name = profile.name.familyName;
                    newUser.accessToken = accessToken;
                    newUser.email = profile.emails[0].value;

                    //insert into the database
                    newUser.save(function (err) {
                        if (err) {
                            console.log(err);
                            return done(null, null); // should redirect us to the login page
                        }

                        return done(null, newUser);
                    })
                }
            });
        });
    };

    passport.use (new FacebookStrategy (fbOpts, fbCallback));

};