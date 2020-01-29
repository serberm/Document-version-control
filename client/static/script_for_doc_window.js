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
  FormData = document.querySelector("#editor-container").innerHTML
  
  console.log("Submitted ", FormData);
  socket.emit('update_doc', {id: thisDocId, text: FormData});
  
  return false;
};

// $('#text').click(function(){
//   $('#editor-container').html(FormData);
// })    To put it back




