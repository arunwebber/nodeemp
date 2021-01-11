var mongoose = require('mongoose');
var companySchema = new mongoose.Schema({
   name: String,
   email: String,
   phone: String,
   department: String,
   state: String,
   city: String,
   zip: Number,
});
mongoose.model('Company', companySchema);
