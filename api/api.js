var router = require('express').Router();
var waterfall = require('async-waterfall');
var faker = require('faker');
var Category = require('../models/category');
var Product = require('../models/product');


router.post('/search',(req,res,next)=>{
	//console.log(req.body.search_term);
	Product.search({
		query_string:{query:req.body.search_term}
	},(err,results)=>{
		if(err) return next(err);
		res.json(results);
	});
});






//for searching or finding a produuct according to category
router.get('/:name',(req,res,next)=>{

//async 
	waterfall([
			function(callback){
				Category.findOne({ name: req.params.name },(err,category)=>{
					if(err) return next(err);
					callback(null, category);
				});
			},
			function(category, callback){
				for(let i = 0; i < 30 ; i++){
					var product = new Product();
					product.category = category._id;
					product.name = faker.commerce.productName();
					product.price = faker.commerce.price();
					product.image = faker.image.image();
					//console.log(product);
					product.save();
				}
			}
		]);
	res.json({message:'Success'});

});

module.exports = router;


