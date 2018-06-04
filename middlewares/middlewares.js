var Cart = require('../models/cart');


module.exports = function(req,res,next){
	if(req.user){
		var total = 0;//to store total number of products
		Cart.findOne({owner:req.user._id},(err,cart)=>{
			if(cart){
				for(var i=0;i<cart.items.length;i++){
					total += cart.items[i].quantity;
				}
				res.locals.cart = total;
			}else{
				res.locals.cart = 0;
			}
			next();
		});
	}else{
		next();
	}
};