var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;
var Category = require('../models/category');

// if you want specific fields to be indexed into es
//use es_indexed:true
var ProductSchema = new Schema({
	name:{type:String,es_indexed:true,es_type:'text'},
	price:Number,
	image:String,
	category:{ type:Schema.Types.ObjectId, 
		ref:'Category',
		es_schema:Category,
		es_indexed:true,
		es_select:'title body'
	},  
	
});

//by adding plugin the model will have a new method called search
// The search method accepts standard Elasticsearch query DSL

ProductSchema.plugin(mongoosastic,{
	hosts:[
	'localhost:9200'
	],
	populate:[{
		path:'category',select:'title body'
	}]
});

module.exports = mongoose.model('Product',ProductSchema);