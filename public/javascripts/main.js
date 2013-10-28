$(function(){ 

	var socket = io.connect('http://localhost:3002')

	socket.on('message', function(message){
		console.log(message)
		$('#room').append('<div>'+message+'  - '+new Date()+'</div>')
	});

	$('#message-input').on('keyup', function(e){
	$el = $(this);
  	if(e.which === 13){
  		$('#room').append('<div><em>'+$el.val()+'  - '+new Date()+'</em></div>')
      socket.emit('message', $el.val());
        $el.val('');
    };
	});

});
