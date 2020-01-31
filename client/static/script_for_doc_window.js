var socket = io();
var thisDocId = $('.doc_id').attr('id');

var quill = new Quill('#editor-container', {
  modules: {
    syntax: true,
    toolbar: '#toolbar-container'
  },
  placeholder: 'Compose an epic...',
  theme: 'snow'
});

socket.emit('get_doc_by_id', {id: thisDocId});
socket.on('found_doc_by_id', function(data){
  if(data.doc.text){
  $('#editor-container').html(data.doc.text);
  }
})


var form = document.querySelector('form');
form.onsubmit = function(event) {
  event.preventDefault();
  console.log('Form submited...');
  let FormData = document.querySelector("#editor-container").innerHTML
  let branchName = $('#branch').val();

  // getting doc from DB
  socket.emit('get_doc_by_id', {id: thisDocId});
  socket.on('found_doc_by_id', function(data){
    //check if has tree exists(root)
    if(!data.doc.root){
      //creating new tree with this doc
      console.log('no root, starting new tree');
      socket.emit('start_new_tree', {doc: data.doc, text: FormData, branch: branchName});
    }
    if(data.doc.root){
      console.log('has root');
      //find last position in this tree and branch
      socket.emit('get_last_position', {root: data.doc.root, branch: branchName});
      socket.on('return_last_position', function(doc){
        console.log('last element returned ', doc);
        socket.emit('create_push_children_new_doc', {doc:{
          _id: doc._id,
          name:doc.name,
          text: FormData,
          root: doc.root,
          branch: branchName,
          position: doc.position
        }});
        socket.on('pushed_to_children', function(data){
          console.log('parent got children ', data);
        })
      })
    }
  })
  socket.on('started_tree', function(data){
    console.log('Started new tree ...', data);
  })
  

  

  
  
  return false;
};






