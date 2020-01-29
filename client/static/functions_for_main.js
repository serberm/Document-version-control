$(document).ready(function(){

  var socket = io();
  socket.emit('get_all_docs');

  socket.on('all_docs_change', function (data) { 
    console.log('received all docs from DB', data.docs);
    data.docs.forEach(doc => {
      $('#docList').append('<li class="nav-item active docClick" id="'+doc._id+'"> <img src="https://pngimage.net/wp-content/uploads/2018/06/logo-document-png.png" width="70" height="70"> <a class="nav-link">'+doc.name+'</a> </li>');
    });
    $('.docClick').click(function(){
      var id = $(this).attr('id');
      console.log('doc clicked');
      $.get("doc_window", function (data) {
        $("#mainBody").append(data, '<div id="'+id+'" class="doc_id"></div>');
      });
    })
  });

  $('#new_doc').click(function(){
    $.get("new_doc", function (data) {
      $("#mainBody").append(data);
    });
  })

  $('#home').click(function(){
    console.log('Home...')
      $("#mainBody").html("");
  })

  socket.on('created_new_doc', function(data){
    console.log('received all docs from DB', data.newDoc);
      $('#docList').append('<li id="doc" class="nav-item active"> <img src="https://pngimage.net/wp-content/uploads/2018/06/logo-document-png.png" width="70" height="70"> <a class="nav-link">'+data.newDoc.name+'</a> </li>');
  });

})