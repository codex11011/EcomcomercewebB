var mongoose = require('mongoose');
var bcrypt = require('bcrypt');   	
//bcrypt is an encryption lib
var crypto = require('crypto');
var Schema = mongoose.Schema;
/*User schema attributes*/

const UserSchema = new Schema({

	//username:{ type: String,  unique: true},
	password:String,
	email:{ type:String, unique:true, lowercase:true , required: true},

	profile:{
		name:{ type:String, default:''},
		picture:{ type:String, default:''}
	},
	address: String,
	history:[{
		paid:{ type:Number, default:0},
		item:{ type: Schema.Types.ObjectId, ref:'Product'}
	}]
});


/* hash the password before we even we save it to database*/


UserSchema.pre('save',function(next){
	 
	 var user = this;
	// console.log(user.password);
	 if(!user.isModified('password')) return next();
	 bcrypt.genSalt(10,function(err,salt){
	 	if(err) return next(err);

	 	bcrypt.hash(user.password, salt, function(err,hash){
	 		if(err) return next(err);
	 		user.password = hash;
	 		next();
	 	});
	 });
});





/*compare password in the database with the one the user types in*/

//creating custom methods
//always use .methods.nameofmethod
UserSchema.methods.comparePassword = function(password){
	return bcrypt.compareSync(password, this.password);
}
//compareSync compares the password
//password - arguement is the one we type in 
//this.passowrd - the one we are comparing with
UserSchema.methods.gravatar = function(size){
	if(!this.size) size = 200;
	if(!this.email) return 'https://gravatar.com/avatar/?s'+size+'&d=retro';
	var md5 = crypto.createHash('md5').update(this.email).digest('hex');
	return 'https://gravatar.com/avatar/'+md5+'?s='+size+'&d=retro';
}

module.exports = mongoose.model('User', UserSchema);
