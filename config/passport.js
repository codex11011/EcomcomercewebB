var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
//serialize and deserialize 

//serialization is a process of translating datastructures or objects 
//state into a format that can be stored  
passport.serializeUser((user, done)=>{
	done(null, user._id);//save in session associated with a ._id 
});


//used for retrieving data from the session
passport.deserializeUser((id, done)=>{
	User.findById(id,(err,user)=>{
		done(err,user); 
	});
});

//authentication middleware

passport.use('local-login',new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
},(req,email,password,done)=>{
	User.findOne({email:email},(err,user)=>{
		if(err) return done(err);

		if(!user) {
			return done(null, false, req.flash('loginMessage','No user has been found'));
	  	}

		if(!user.comparePassword(password)){
			return done(null, false, req.flash('loginMessage','Oops! Wrong Password pal'));
		}

		return done(null, user);
	});
}));



//custom function to validate

exports.isAuthenticated = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}	 




