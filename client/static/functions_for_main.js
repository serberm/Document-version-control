var Global_treeData;

$(document).ready(function(){

  var socket = io();
  socket.emit('get_all_docs_of_last_position');

  socket.on('all_docs_change', function (data) { 
    console.log('received all docs from DB', data.docs);
    data.docs.forEach(doc => {
      $('#docList').append('<div class="col-xs-2 docClick" id="'+doc._id+'"><div><img src="https://pngimage.net/wp-content/uploads/2018/06/logo-document-png.png" width="70" height="70"></div><div>'+doc.name+'</div></div>');
    });
    $('.docClick').click(function(){
      var id = $(this).attr('id');
      var thisDoc = {};
      console.log('doc clicked');
      $.get("doc_window", function (data) {
        $("#mainBody").append(data, '<div id="'+id+'" class="doc_id"></div>');
        $("#form-container").append('<button id="version_control" type="button" class="btn btn-success">Version Control</button>');
        $("#version_control").click(function(){
          $.get("d3_tree", function(data){
            $("#form-container").append(data);
            socket.emit("get_doc_by_id", {id:id});
            socket.on('found_doc_by_id', function(data){
              console.log('received root to get tree...', data.doc.root);
              socket.emit('get_tree', {root:data.doc.root});
              socket.on('return_tree', function(data){
                console.log('got tree ...', data.tree);
                Global_treeData = data.tree;
                update(root); // creating d3 (trigger)
              })
            })
          });
        })
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
      $('#docList').append('<div class="col-xs-2 docClick" id="'+data.newDoc._id+'"><div><img src="https://pngimage.net/wp-content/uploads/2018/06/logo-document-png.png" width="70" height="70"></div><div>'+data.newDoc.name+'</div></div>');
  });

})