const mongoose = require('mongoose');


module.exports = function(){
  const DocSchema = new mongoose.Schema({
    name: String,
    text: String,
   })
   const Doc = mongoose.model('Doc', DocSchema);
}