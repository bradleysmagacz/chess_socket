
module.exports = function(io, socket) {
	
    socket.on('move', function(msg) {
    	console.log('Picked up the move');
        socket.broadcast.emit('move', msg);
    });

};