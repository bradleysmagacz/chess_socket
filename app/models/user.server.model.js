/*jslint node: true */
'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	createdDate = require('../plugins/createdDate'),
	crypto = require('crypto'),
	validEmail = require('../helpers/validate/email');

//Define user schema
var UserSchema =  new Schema({
  email: { 
    	type: String, 
    	lowercase: true, 
    	trim: true, 
    	validate: validEmail, 
    	index: { unique: true }
  },
  username: { 
      type: String, 
      unique: true, 
      required: 'Username is required', 
      trim: true 
  },
	name: { 
  		first: String, 
  		last: String 
  },
  rating: {
      type: Number,
      default: 1500
  },
  wins: {
      type: Number,
      default: 0
  },
  losses: {
      type: Number,
      default: 0
  },
  draws: {
      type: Number,
      default: 0
  },
	password: { 
  		type: String, 
  		required: true 
  },
	salt: { 
  		type: String 
  },
  provider: {
      type: String,
      required: 'Provider is required'
  },
  providerId: String,
  providerData: {},
	isAdmin: { 
  		type: Boolean, 
  		default: 0 
  },
	resetPasswordToken: { 
  		type: String 
  },
	resetPasswordExpires: { 
  		type: Date 
  }
});

UserSchema.plugin(createdDate);

//Virtual function to return full name
UserSchema.virtual('fullname').get(function () {
  return this.name.first + ' ' + this.name.last;
});

//Virtual function to return user's record
UserSchema.virtual('record').get(function() {
  return this.wins + 'W-' + this.losses + 'L-' + this.draws + 'D';
});

UserSchema.set('toJSON', { getters: true, virtuals: true });

//Hash password before saving to db
UserSchema.pre('save', function(next) { 

	if(this.password) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

  this.wasNew = this.isNew;

	next();
});

//Method for hashing password
UserSchema.methods.hashPassword = function(password) {
	return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

//Method for authenticating password
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

//Log any new user changes
UserSchema.post('save', function(next) {
	if (this.wasNew) {
		console.log('A new user was created');
	}
	else {
		console.log('A user updated their information');
	}
});

//Validate password against regular expression
UserSchema.path('password').validate(function(password) {  

  var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  return regex.test(password);
}, "Password must be 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number");

//Return model
mongoose.model('User', UserSchema);