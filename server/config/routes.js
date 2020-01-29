const quotes = require('../controllers/quotes.js');
const mongoose = require('mongoose'),
Doc = mongoose.model('Doc')

module.exports = function(app, io){



  app.get('/', (request, response) => {
    response.render("main");
  });

  app.get('/new_doc', (request, response) => {
    response.render("new_doc");
  });

  app.get('/doc_window', (request, response) => {
    response.render("doc_window");
  });

  app.get('/d3_tree', (request, response) => {
    response.render("d3_tree");
  });


  io.on('connection', function(socket){ 
    console.log('Started connection with client...');
    
    socket.on('new_doc', function(data){
      const doc = new Doc();
      doc.name = data.name;
      doc.text = data.text;
      doc.save()
      .then(newDoc => {
        console.log('created new doc ', newDoc);
        io.emit('created_new_doc', {newDoc: newDoc});
      })
      .catch(err => {
        io.emit('created_new_doc', {err: err});
      })
    })

    socket.on('update_doc', function(data){
      Doc.updateOne({_id: data.id},{
        text: data.text
      })
      .then(doc => {
        console.log('updated doc ', doc);
      })
      .catch(err => {
        console.log('error updating doc', err);
      })
    })
    
    socket.on('get_all_docs', function(){
      Doc.find()
      .then(docs => {
        socket.emit('all_docs_change', {docs: docs});
      })
      .catch(err => {
        socket.emit('all_docs_change', {err: err});
      })
      })

    socket.on('get_doc_by_id', function(data){
      Doc.findOne({_id: data.id})
      .then(doc => {
        socket.emit('found_doc_by_id', {doc: doc});
      })
      .catch(err => {
        socket.emit('found_doc_by_id', {err: err});
      })
      })
  });

}