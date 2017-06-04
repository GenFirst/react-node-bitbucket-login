'use strict';

var passport = require('passport'),
  BitbucketTokenStrategy = require('passport-bitbucket-token'),
  User = require('mongoose').model('User');

module.exports = function () {

  passport.use(new BitbucketTokenStrategy({
      clientID: 'app-id',
      clientSecret: 'client-secret'
    },
    function (accessToken, refreshToken, profile, done) {
      User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
        return done(err, user);
      });
    }));

};