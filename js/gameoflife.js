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
		_callbacks = {
			fn: undefined,
			scope: undefined
		},
		_speed,
		
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
		_speed = config.speed || 1000;
		
		if (typeof config.callbacks !== 'undefined') {
			_callbacks = config.callbacks;
		}
		
		_cells = _createMap();
		
		_initCells('abcdefghijklmnopqrstuvwxyz');
		this.cells = _cells;
	}
	
	_tick = function() {
		_callbacks.tickStart.call(_callbacks.scope);
		
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
				
				_callbacks.refreshCell.call(_callbacks.scope, x, y, newCells[x][y]);
			}
		}
		
		_cells = newCells;
		this.cells = _cells;

		_callbacks.tickEnd.call(_callbacks.scope);
		//if (typeof _callbackOnTick.fn !== 'undefined') {
		//	_callbackOnTick.fn.call(_callbackOnTick.scope, _cells);
		//}
	};
	_start = function() {
		_stop();
		
		_interval = setInterval(function() {
			_tick();
		}, _speed);
	};
	_stop = function() {
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
		
		var x = _width, y, i = 0;
		for (x = 0; x < _width; x++) {
			//y = _height;
			for (y = 0; y < _height; y++) {
				_cells[x][y] = strAsBin[i++] === '1';
				
				if (i == strAsBin.length) i = 0;
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
		tick: _tick
	};
	
	return _Constr;
}());
