'use strict';

var passport = require('passport'),
  BitbucketTokenStrategy = require('passport-bitbucket-token'),
  User = require('mongoose').model('User');

module.exports = function () {

  passport.use(new BitbucketTokenStrategy({
      clientID: 'app-id',
      clientSecret: 'client-secret',
      profileWithEmail: true,
      apiVersion: '2.0'
    },
    function (accessToken, refreshToken, profile, done) {
      User.upsertBitbuketUser(accessToken, refreshToken, profile, function(err, user) {
        return done(err, user);
      });
    }));

};