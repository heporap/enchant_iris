/**
 enchant.dab.Iris
 version 1.1
 
Copyright (c) 2013 Wicker Wings
http://www.wi-wi.jp/

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 
 usage
 
 enchant();
 var iris = new enchant.dab.Iris(game.width, game.height, game.fps);
 scene.addChild(iris);
 
 or
 
 enchant('dab');
 var iris = new Iris(game.width, game.height, game.fps);
 scene.addChild(iris);
 
**/
 (function(enchant){
if( !enchant ){
	return;
}
if( !enchant.dab ){
	enchant.dab  = {};
}

var _context,
_irisX = 0,
_irisY = 0,
_irisRfrom = 0,
_irisRto = -1,
_irisRmax = 0,
_irisTime = 0,
_easing = enchant.Easing.Linear,
_width = 0,
_height = 0,
_fps = 0,
_irisRemove = false,
_age = 0;

function initialize(width, height, fps) {
	enchant.Group.call(this);
	
	_width = width||enchant.Core.instance.width;
	_height = height||enchant.Core.instance.height;
	_fps=fps||enchant.Core.instance.fps;
	
	var sprite = new Sprite(_width, _height);
	var surface = new Surface(_width, _height);
	sprite.image = surface;
	_context = sprite.image.context;
	
	fillColor(0, 0, 0, 1.0);
	setCenter(_width/2, _height/2);
	setTime(2, enchant.Easing.LINEAR);
	_irisIo = 'out';
	
	this.addChild(sprite);
	this.addEventListener('enterframe', main);

}

function fillColor(r, g, b, a){
	_context.fillStyle = color(r||0, g||0, b||0, a||1.0);
	return this;
}
function strokeColor(r, g, b, a){
	_context.strokeStyle = color(r||0, g||0, b||0, a||1.0);
	return this;
}

function setCenter(x, y){
	_irisX = x;
	_irisY = y;
	calcRadius();
	return this;
}

function setRadius(r){
	_irisRto = r;
	return this;
}

function restart(){
	_age = 0;
}
function resetCircle(){
	_irisRto = -1;
	calcRadius();
	return this;
}


function setTime(t, easing){
	_irisTime = t*_fps;
	if( easing ){
		_easing = easing;
	}
	return this;
}

function color(r, g, b, a){
	return 'rgba('+r+','+g+','+b+','+a+')';
}

function calcRadius(){
	var width = Math.max(_irisX, _width-_irisX);
	var height = Math.max(_irisY, _height-_irisY);
	_irisRfrom = _irisRmax = Math.sqrt( Math.pow(width, 2) + Math.pow(height, 2) );
}

function main(){
	
	_age++;
	if( _age <= _irisTime ){
		var irisR;
		if( _irisRto===-1 ){
			irisR = _irisRfrom;
		}else{
			irisR = ( _irisIo === 'out' )? _irisRfrom - _irisRto: _irisRto;
		}
		var r = _easing( _age, 0, irisR, _irisTime );
		if( _irisIo === 'out' ){
			r = _irisRfrom - r;
		}
		var ctx = _context;
		
		ctx.globalCompositeOperation = 'source-over';
		ctx.fillRect(0, 0, _width, _height);
		
		ctx.globalCompositeOperation = 'destination-out';
		ctx.beginPath();
		ctx.arc(_irisX, _irisY, r, 0, Math.PI*2, false);
		ctx.fill();
		
	}else{
		if( _irisRto !== -1 ){
			_irisRfrom = _irisRto;
			_irisRto = -1;
		}
		if( _irisRemove ){
			this.scene.removeChild(this);
		}
	}

}

enchant.dab.Iris = enchant.Class.create(enchant.Group, {
	initialize: initialize,
	setColor: fillColor,
	fillColor: fillColor,
	strokeColor: strokeColor,
	setCenter: setCenter,
	setTime: setTime,
	setRadius: setRadius,
	resetCircle: resetCircle,
	restart: restart,
	inout: {
		get: function(){
			return _irisIo;
		},
		set: function(io){
			_irisIo = io;
		}
	},
	toRemove: {
		get: function(){
			return _irisRemove;
		},
		set: function(m){
			_irisRemove = m;
		}
	}
});


})(enchant);
