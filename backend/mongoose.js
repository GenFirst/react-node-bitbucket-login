'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

module.exports = function () {

  var db = mongoose.connect('mongodb://localhost:27017/bitbucket-demo');

  var UserSchema = new Schema({
    email: {
      type: String, required: true,
      trim: true, unique: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    bitbucketProvider: {
      type: {
        id: String,
        token: String
      },
      select: false
    }
  });

  UserSchema.set('toJSON', {getters: true, virtuals: true});

  UserSchema.statics.upsertBitbuketUser = function(accessToken, refreshToken, profile, cb) {
    var that = this;
    return this.findOne({
      'bitbucketProvider.id': profile.id
    }, function(err, user) {
      // no user was found, lets create a new one
      if (!user) {
        var newUser = new that({
          email: profile.emails[0].value,
          bitbucketProvider: {
            id: profile.id,
            token: accessToken
          }
        });

        newUser.save(function(error, savedUser) {
          if (error) {
            console.log(error);
          }
          return cb(error, savedUser);
        });
      } else {
        return cb(err, user);
      }
    });
  };

  mongoose.model('User', UserSchema);

  return db;
};