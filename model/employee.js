var mongoose = require('mongoose');
var employeeSchema = new mongoose.Schema({
   name: String,
   email: String,
   phone: String,
   department: String,
   state: String,
   city: String,
   zip: Number,
   dob: { type: Date, default: Date.now },
});
mongoose.model('Employee', employeeSchema);
