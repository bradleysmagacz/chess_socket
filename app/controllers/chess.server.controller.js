
module.exports = function(io, socket) {
	
	//Emit message when player has joined game
	io.emit('move', {
        type: 'status',
        text: 'has joined the match',
        created: Date.now(),
        username: socket.request.user.username
    });
    
    //Emit move when player has finished their turn
    socket.on('move', function(move) {
    	console.log('Player moved to square ' + JSON.stringify(move.san));
    	move.username = socket.request.user.username;
    	move.created = Date.now();
    	move.position = JSON.stringify(move.san);
        io.emit('move', move);
    });

    //Emit game over message after checkmate/stalemate
    socket.on('gameOver', function(move) {
    	console.log('Game has ended');
        socket.broadcast.emit('gameOver', move);
    });

    //Emit message when player has left the game
    socket.on('disconnect', function() {
        io.emit('move', {
            type: 'status',
            text: 'has left the match',
            created: Date.now(),
            username: socket.request.user.username
        });
    });

};