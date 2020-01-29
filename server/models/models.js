const mongoose = require('mongoose');


module.exports = function(){
  const DocSchema = new mongoose.Schema({
    name: String,
    text: String,
   })

   const TreeSchema = new mongoose.Schema({
     name: String,
     parent: String,
     children: [DocSchema]
   })

   const Doc = mongoose.model('Doc', DocSchema);
   const Tree = mongoose.model('Tree', TreeSchema);
}