const mongoose = require('mongoose');


module.exports = function(){

  const DocSchema = new mongoose.Schema({
    name: String,
    text: String,
    root: String,
    branch: String,
    position: Number,
    children: [String]
   });

   const Doc = mongoose.model('Doc', DocSchema);
}