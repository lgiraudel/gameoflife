if (typeof GoL === 'undefined') {
	GoL = {};
}

GoL.Viewer = (function() {
	var
		// Constructor
		_Constr,
		
		// Private properties
		_board,
		_ctx,
		_width,
		_height,
		_canvas,
		
		// Private methods
		_refreshCell,
		_tickStart,
		_tickEnd,
		_start,
		_stop,
		_tick;
		
	_tickStart = function() {
		_canvasData = _ctx.createImageData(_width, _height);
	};
	_refreshCell = function(x, y, alive) {
		var idx = (x + y * _width) * 4;
		
		_canvasData.data[idx + 0] = alive ? 0 : 255;
		_canvasData.data[idx + 1] = alive ? 0 : 255;
		_canvasData.data[idx + 2] = alive ? 0 : 255;
		_canvasData.data[idx + 3] = 255;
	};
	_tickEnd = function() {
		_ctx.putImageData(_canvasData, 0, 0);
	};
		
	/*
	_refreshCanvas = function(cells) {
		var canvasData = _ctx.createImageData(_width, _height),
			index,
			x,
			y;
		
		for (x = 0; x < _width; x++) {
			for (y = 0; y < _height; y++) {
				index = (x + y * _width) * 4;
				
				if (cells[x][y]) {
					canvasData.data[index + 0] = 0; // R
					canvasData.data[index + 1] = 0; // G
					canvasData.data[index + 2] = 0; // B
					canvasData.data[index + 3] = 255; // A
				} else {
					canvasData.data[index + 0] = 255; // R
					canvasData.data[index + 1] = 255; // G
					canvasData.data[index + 2] = 255; // B
					canvasData.data[index + 3] = 255; // A
				}
			}
		}
		
		_ctx.putImageData(canvasData, 0, 0);
	};
	*/
	_start = function() {
		_board.start();
	};
	_stop = function() {
		_board.stop();
	};
	_tick = function() {
		_board.tick();
	};
		
	_Constr = function(config) {
		if (typeof config.canvas !== undefined) {
			_canvas = config.canvas;
			
			_ctx = _canvas.getContext('2d');
			this.ctx = _ctx;
			_width = _canvas.width;
			_height = _canvas.height;
			
			_board = new GoL.Board({
				width: _width,
				height: _height,
				callbacks: {
					refreshCell: _refreshCell,
					tickStart: _tickStart,
					tickEnd: _tickEnd,
					scope: this
				},
				speed: config.speed || 1000
			});
			
			this.board = _board;
		}
	};
	
	_Constr.prototype = {
		start: _start,
		stop: _stop,
		tick: _tick
	};
	
	return _Constr;
}());

var viewer = new GoL.Viewer({
	canvas: document.getElementsByTagName('canvas')[0],
	speed: 100
});
//viewer.start();