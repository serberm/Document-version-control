const quotes = require('../controllers/quotes.js');
const mongoose = require('mongoose');
Doc = mongoose.model('Doc');

function containsRoot(array, doc){
  array.forEach(element => {
    if(element.root == doc.root){
      return true;
    }
  })
  return false;
}


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

    socket.on('create_doc', function(data){
      const doc = new Doc();
      doc.name = data.name;
      doc.save()
      .then(newDoc => {
        console.log('created new doc ', newDoc);
        io.emit('created_new_doc', {newDoc: newDoc});
      })
      .catch(err => {
        io.emit('created_new_doc', {err: err});
      })
    })

    socket.on('start_new_tree', function(data){
      Doc.findOneAndUpdate({_id: data.doc._id},{
        text: data.text,
        root: data.doc._id,
        branch: data.branch,
        position: 1
      },{new:true})
      .then(updatedDoc => {
        console.log('updated doc/strated new tree ', updatedDoc);
        socket.emit('started_tree', {updatedDoc: updatedDoc});
      })
      .catch(err => {
        socket.emit('started_tree', {err: err});
      })
    });

    socket.on('get_tree', function(data){
      Doc.find({root: data.root})
      .then(tree => {
        io.emit('return_tree', {tree: tree});
      })
      .catch(err => {
        io.emit('return_tree', {err: err});
      })
    })

    socket.on('get_last_position', function(data){
      Doc.find()
      .then(docs => {
        let lastDoc = {position:0, name:'No Docs'};
        docs.forEach(doc => {
          if(doc.branch==data.branch && doc.root==data.root && doc.position > lastDoc.position){
            lastDoc = doc;
          }
        });
        socket.emit('return_last_position', lastDoc);
      })
      .catch(err => {
        socket.emit('return_last_position', {err: err});
      })
    })

    socket.on('create_push_children_new_doc', function(data){
      const doc = new Doc();
      doc.name = data.doc.name;
      doc.text = data.doc.text;
      doc.root = data.doc.root;
      doc.branch = data.doc.branch;
      doc.position = data.doc.position + 1;
      doc.save()
      .then(newDoc => {
        Doc.findOneAndUpdate({_id:data.doc._id},{
          $push: {children: newDoc._id}
        },{new:true})
        .then(updatedDoc => {
          socket.emit('pushed_to_children', updatedDoc);
        })
        .catch(err => {
          socket.emit('pushed_to_children', {err: err});
        })
      })
      .catch(err => {
        socket.emit('pushed_to_children', {err: err});
      })
    })

    socket.on('get_all_docs_of_last_position', function(){
      Doc.find()
      .then(docs => {
        let lastPositionDocs = [];
        docs.forEach(doc => {
          if(!containsRoot(lastPositionDocs, doc)){
            if(!doc.children.length){
              lastPositionDocs.push(doc);
            }
          }
        })
        socket.emit('all_docs_change', {docs: lastPositionDocs});
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