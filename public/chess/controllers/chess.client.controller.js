angular.module('chess').controller('ChessController', ['$scope', 'Socket',
	function($scope, Socket) {

		$scope.moves = [];

		Socket.on('move', function(move) {
    		game.move(move);
    		board.position(game.fen());
    		$scope.moves.push(move);
		});

		Socket.on('message', function(message) {
    		$scope.messages.push(message);
		});

		// do not pick up pieces if the game is over
		var onDragStart = function(source, piece, position, orientation) {
		  if (game.game_over() === true ||
		      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
		      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
		    return false;
		  }
		};

		var onDrop = function(source, target) {
			
			var move = game.move({
				from: source, 
				to: target,
				promotion: 'q'
			});

			var message = {
				text: 'HELLLLLOOOOO'
			}

			if (move === null) {
				return 'snapback';
			} else {
				updateStatus();
				Socket.emit('move', move);
			}
		};

		var cfg = {
			draggable: true,
			position: 'start',
			onDragStart: onDragStart,
			onDrop: onDrop
		};

		var board = new ChessBoard('gameBoard', cfg);
		var game = new Chess();

		var updateStatus = function() {
		  /*var status = '';

		  var moveColor = 'White';
		  if (game.turn() === 'b') {
		    moveColor = 'Black';
		  }*/

		  var gameOver = game.in_checkmate();
		  var stalemate = game.in_draw();
		  
		  if (gameOver) {
		  	status = 'Game over, stalemate';
		    Socket.emit('gameOver', gameOver);
		  }

		  else if (stalemate) {
		    status = 'Game over, stalemate';
		    Socket.emit('stalemate', stalemate);
		  }

		  // game still on
		  /*else {
		    status = moveColor + ' to move';

		    // check?
		    if (game.in_check() === true) {
		      status += ', ' + moveColor + ' is in check';
		    }
		  }*/

		  //statusEl.html(status);
		  //fenEl.html(game.fen());
		  //pgnEl.html(game.pgn());
		};

		var toggleOrientation = function() {
			
			if (board.orientation()=='white') {
				board.orientation('black');
			} else {
				board.orientation('white');
			}
		};

		$scope.flipBoard = function() {
			toggleOrientation();
		};

		$scope.sendMessage = function() {
			var message = {
				text: this.messageText
			}

			Socket.emit('message', message);

			this.messageText = '';
		};
	}
]);
