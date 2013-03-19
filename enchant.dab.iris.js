/**
 enchant.dab.Iris
 version 1.3
 
Copyright (c) 2013 Wicker Wings

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/
 (function(enchant){
if( !enchant.dab ){
	enchant.dab  = {};
}

function initialize(width, height, fps) {
	enchant.Group.call(this);
	
	this._irisX= 0;
	this._irisY= 0;
	this._irisRfrom= 0;
	this._irisRto= -1;
	this._irisR= 0;
	this._irisRmax= 0;
	this._irisTime= 0;
	this._irisMovetime = 0;
	this._irisIo= 'out';
	this._irisReverse= false;
	this._irisRemove= false;
	this._irisWait= false;
	this._age= 0;
	
	this._fillColors= [0,0,0,1.0];
	this._irisEasing = enchant.Easing.Linear;
	this._width = width||enchant.Core.instance.width;
	this._height = height||enchant.Core.instance.height;
	this._fps=fps||enchant.Core.instance.fps;
	
	this.surface = new Surface(this._width, this._height);
	this.sprite = new Sprite(this._width, this._height);
	this.sprite.image = this.surface;
	this.sprite.touchEnabled=false;
	this._context = this.sprite.image.context;
	
	fillColor.apply(this, this._fillColors);
	setCenter.call(this, this._width/2, this._height/2);
	setTime.call(this, 2, enchant.Easing.LINEAR);
	
	calcRadius.call(this);
	this._irisIo = 'out';
	this._irisRfrom = this._irisRmax;
	
	this.addChild(this.sprite);
	this.addEventListener('addedtoscene', preview);
	this.addEventListener('enterframe', main);

}

function fillColor(r, g, b, a){
	this._fillColors[0]=r;
	this._fillColors[1]=g;
	this._fillColors[2]=b;
	this._fillColors[3]=a;
	this._context.fillStyle = color(r, g, b, a);
	return this;
}

function setCenter(x, y){
	this._irisX = x;
	this._irisY = y;
	calcRadius();
	return this;
}

function setRadius(r){
	this._irisRto = r;
	return this;
}

function setReverse(b){
	this._irisReverse = b;
	return this;
}

function restart(){
	this._age = 0;
	return;
}
function resetCircle(){
	this._irisRto = -1;
	this._irisRfrom=(this._irisIo==='out')?this._irisRmax:0;
	return this;
}

function moveTime(x, y, t){
	this._irisXfrom = this._irisX;
	this._irisYfrom = this._irisY;
	this._irisXto = x-this._irisXfrom;
	this._irisYto = y-this._irisYfrom;
	this._irisMoveStarttime = this._age;
	this._irisMovetime = t*this._fps;
	return this;
}

function setTime(t, easing){
	this._irisTime = t>0? t*this._fps: 1;
	if( easing ){
		this._irisEasing = easing;
	}
	return this;
}

function color(r, g, b, a){
	return 'rgba('+r+','+g+','+b+','+a+')';
}

function calcRadius(){
	var width = Math.max(this._irisX, this._width-this._irisX);
	var height = Math.max(this._irisY, this._height-this._irisY);
	this._irisRmax = Math.sqrt( Math.pow(width, 2) + Math.pow(height, 2) );
}

function preview(){
	coordinateRadius.call(this);
	draw.call(this);
}

function main(){
	
	if( this._irisWait ){
		draw.call(this);
		return;
	}
	
	this._age++;
	if( this._irisMovetime ){
		coordinateCenter.call(this);
	}
	
	if( this._age <= this._irisTime ){
		coordinateRadius.call(this);
		
	}else if( !this._irisMovetime ){
		if( this._irisRto !== -1 ){
			this._irisRfrom = this._irisRto;
			this._irisRto = -1;
		}
		
		if( this._irisRemove ){
			this.scene.removeChild(this);
			this.sprite=this.sprite.image=this.surface=this._context=null;
		}
		return;
	}
	draw.call(this);
	
	if( this._age===this._irisTime ){
		this.dispatchEvent(new enchant.Event('irisend'));
	}
	
}
function coordinateRadius(){
	var irisR;
	if( this._irisRto===-1 ){
		irisR = this._irisRmax;
	}else{
		irisR = ( this._irisIo === 'out' )? this._irisRfrom - this._irisRto: this._irisRto;
	}
	var r = this._irisEasing( this._age, 0, irisR, this._irisTime );
	if( this._irisIo === 'out' ){
		r = this._irisRfrom - r;
	}
	this._irisR=r;
}
function coordinateCenter(){
	if( this._irisX === this._irisXfrom+this._irisXto && this._irisY === this._irisYfrom+this._irisYto ){
		this._irisMovetime = 0;
	}else{
		this._irisX = this._irisXfrom + this._irisEasing( this._age-this._irisMoveStarttime, 0, this._irisXto, this._irisMovetime );
		this._irisY = this._irisYfrom + this._irisEasing( this._age-this._irisMoveStarttime, 0, this._irisYto, this._irisMovetime );
	}
}

function draw(){
	var ctx = this._context;
	ctx.globalCompositeOperation = 'source-over';
	if( this._irisReverse ){
		ctx.clearRect(0, 0, this._width, this._height);
	}else{
		ctx.fillRect(0, 0, this._width, this._height);
		ctx.globalCompositeOperation = 'destination-out';
	}
	ctx.beginPath();
	ctx.arc(this._irisX, this._irisY, this._irisR, 0, Math.PI*2, false);
	ctx.fill();
	
}

enchant.dab.Iris = enchant.Class.create(enchant.Group, {
	initialize: initialize,
	setColor: fillColor,
	fillColor: fillColor,
	setCenter: setCenter,
	setTime: setTime,
	setRadius: setRadius,
	resetCircle: resetCircle,
	restart: restart,
	setReverse: setReverse,
	moveTime: moveTime,
	irisWait: {
		get: function(){
			return this._irisWait;
		},
		set: function(w){
			this._irisWait=w;
		}
	},
	inout: {
		get: function(){
			return this._irisIo;
		},
		set: function(io){
			this._irisIo = io;
			resetCircle.call(this);
		}
	},
	toRemove: {
		get: function(){
			return this._irisRemove;
		},
		set: function(m){
			this._irisRemove = m;
		}
	},
	width: {
		get: function(){
			return this._width;
		},
		set: function(width){
			this._width=width;
			this.sprite.width=this._width;
			this.surface.width=this._width;
			calcRadius.call(this);
		}
	},
	height: {
		get: function(){
			return this._height;
		},
		set: function(height){
			this._height=height;
			this.sprite.height=this._height;
			this.surface.height=this._height;
			calcRadius.call(this);
		}
	},
	touchEnabled: {
		get: function(){
			return this.sprite.touchEnabled;
		},
		set: function(b){
			this.sprite.touchEnabled=b;
		}
	}
});
})(enchant);
