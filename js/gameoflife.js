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
		_createMap,
		_stringToBin,
		_charToBin,
		_initCells,
		_getLiveNeighbours;
	
	_Constr = function(config) {
		var i;

		_width = config.width || 10;
		_height = config.height || 10;
		
		_cells = _createMap();
		
		_initCells('abcde');
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
					
					// rule 2
					if (liveNeighbours === 2 || liveNeighbours === 3) {
						newCells[x][y] = true;
					} else {
						// Rules 1 & 3
						newCells[x][y] = false;
					}
				} else {
					// Cell is dead
					
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
	_initCells = function(str) {
		var strAsBin = _stringToBin(str);
		console.log(strAsBin);
		
		var x = _width, y, i = strAsBin.length;
		while (x--) {
			y = _height;
			while (y--) {
				_cells[_width - x - 1][_height - y - 1] = strAsBin[strAsBin.length - (--i) - 1] === '1';
				
				if (!i) i = strAsBin.length;
			}
		}
	};
	
	_stringToBin = function(str) {
		var res = '';
		for (var c in str) {
			res += _charToBin(str.charCodeAt(c));
		}
		return res;
	};
	_charToBin = function(c) {
		var res = '', i = 8;

		while (i--) {
			var tmp = c >> i;
			if (tmp) c ^= ((1) << i);
			res += tmp;
		}
		return res;
	};
	
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