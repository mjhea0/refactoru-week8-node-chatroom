$(function(){

  // connect to the the socket server
  var socket = io.connect('http://localhost');

  // socket event handlers
  socket.on('connect', function(id, message){

    socket.on('users', function(users) {
      $('#users').empty();
        for (var key in users) {
          $('#users').append('<div>'+users[key]+'</div>');
      };
    });

    socket.on('message', function(message){
      if (message.user != undefined){
        $('#room').append('<div><em>'+message.user+'</em>: <span style="color:red">'+message.message+'</span></div>');
      } else {
        $('#room').append('<div>'+message+'</div>');
      };
    });

    socket.on('disconnect', function(disconnect){
      $('#room').append('<div>'+disconnect+'</div>');
    });

  });

  // jquery event handlers
  $('#message-input').on('keyup', function(e){
    if(e.which === 13){
      var userMessage = $(this).val();
      socket.emit('message', userMessage);
      $(this).val(''); 
    };
  });

});