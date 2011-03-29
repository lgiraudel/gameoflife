// Game Of Life
GoL = {};

GoL.log = function(msg) {
	if (typeof console !== 'undefined') console.log(msg);
};

GoL.Board = (function() {
	var 
		// Constructor
		_Constr,
		
		// Private properties
		_width,
		_height,
		_interval,
		_cells,
		
		// Private methods
		_tick,
		_start,
		_stop,
		_createMap;
	
	_Constr = function(config) {
		var i;

		_width = config.width || 10;
		_height = config.height || 10;
		
		_cells = _createMap();
		
		this.cells = _cells;
		
		this.start();
	}
	
	_tick = function() {
		GoL.log('_tick()');
		
		var newCells = _createMap(),
			x = _width,
			y,
			liveNeighbours;
			
		while (x--) {
			y = _height;
			while (y--) {
				liveNeighbours = _getLiveNeighbours(x, y);

				if (_cells[x][y]) {
					// Cell is alive
					GoL.log(x + ',' + y + ' is alive with ' + liveNeighbours + ' live neighbours.');
					
					// rule 2
					if (liveNeighbours === 2 || liveNeighbours === 3) {
						newCells[x][y] = true;
					} else {
						// Rules 1 & 3
						newCells[x][y] = false;
					}
				} else {
					// Cell is dead
					GoL.log(x + ',' + y + ' is dead with ' + liveNeighbours + ' live neighbours.');
					
					// rule 4
					if (liveNeighbours === 3) {
						newCells[x][y] = true;
					} else {
						newCells[x][y] = false;
					}
				}
			}
		}
		
		_cells = newCells;
		this.cells = _cells;
	};
	_start = function() {
		GoL.log('_start()');
		
		_stop();
		
		_interval = setInterval(function() {
			_tick();
		}, 1000);
	};
	_stop = function() {
		GoL.log('_stop()');
		clearInterval(_interval);
	};
	_createMap = function() {
		var map = new Array(_width),
			i = _width;
		
		while (i--) {
			map[i] = new Array(_height);
		}
		
		return map;
	};
	_getLiveNeighbours = function(x, y) {
		var count = 0;
		
		if (x > 0 && y > 0 && _cells[x - 1][y - 1]) count++;
		if (x > 0 && _cells[x - 1][y]) count++;
		if (x > 0 && y < _height - 1 && _cells[x - 1][y + 1]) count++;
		if (y > 0 && _cells[x][y - 1]) count++;
		if (y < _height - 1 && _cells[x][y + 1]) count++;
		if (x < _width - 1 && y > 0 && _cells[x + 1][y - 1]) count++;
		if (x < _width - 1 && _cells[x + 1][y]) count++;
		if (x < _width - 1 && y < _height - 1 && _cells[x + 1][y + 1]) count++;
		
		return count;
	}
	
	_Constr.prototype = {
		start: _start,
		stop: _stop,
		step: _tick
	};
	
	return _Constr;
}());

var board = new GoL.Board({
	width: 3,
	height: 5
});
board.stop();
GoL.log(board.cells);