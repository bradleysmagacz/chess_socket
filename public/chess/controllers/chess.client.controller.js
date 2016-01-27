angular.module('chess').controller('ChessController', ['$scope', 'Socket',
	function($scope, Socket) {

		Socket.on('move', function (message) {
    		game.move(message);
    		board.position(game.fen());
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

			if (move === null) {
				return 'snapback';
			} else { 
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
		  var status = '';

		  var moveColor = 'White';
		  if (game.turn() === 'b') {
		    moveColor = 'Black';
		  }

		  // checkmate?
		  if (game.in_checkmate() === true) {
		    status = 'Game over, ' + moveColor + ' is in checkmate.';
		  }

		  // draw?
		  else if (game.in_draw() === true) {
		    status = 'Game over, drawn position';
		  }

		  // game still on
		  else {
		    status = moveColor + ' to move';

		    // check?
		    if (game.in_check() === true) {
		      status += ', ' + moveColor + ' is in check';
		    }
		  }

		  statusEl.html(status);
		  fenEl.html(game.fen());
		  pgnEl.html(game.pgn());
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
	}
]);

/*angular.module('chess').directive('flipBoard', [function() {
    return {
        scope: { board: '=' },
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                alert('hi');
            });
        }
    };
}]);*/
