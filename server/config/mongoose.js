module.exports = function(){

  const mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/Google_Doc_DB', {useNewUrlParser: true});
  
}