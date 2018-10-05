var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
	name:{ type: String, unique:true, lowercase:true}
});

module.exports = mongoose.model('Category',CategorySchema);


//5b0c07a919e9f9698cf7506a		