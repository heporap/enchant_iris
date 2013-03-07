/**
 enchant.dab.Iris
 version 1.0
 
Copyright (c) 2013 Wicker Wings
http://www.wi-wi.jp/

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 
 usage
 
 enchant();
 var iris=new enchant.dab.Iris(game.width, game.height, game.fps);
 scene.addChild(iris);
 
 or
 
 enchant('dab');
 var iris=new Iris(game.width, game.height, game.fps);
 scene.addChild(iris);
 
**/
 (function(){
if( !enchant ){
	return;
}
if( !enchant.dab ){
	enchant.dab ={};
}

var context;

function initialize(width, height, fps) {
	enchant.Group.call(this, width, height);
	
	this.width=width;
	this.height=height;
	this._irisX=0;
	this._irisY=0;
	this._irisR=-1;
	this._irisR_=0;
	this._irisTime=0;
	this._easing=null;
	this._fps=fps||30;
	this._irisRemove=false;
	this._age=0;
	
	this._sprite=new Sprite(width, height);
	var surface=new Surface(width, height);
	this._sprite.image=surface;
	context=this._sprite.image.context;
	
	this.setColor(0, 0, 0, 1.0);
	this.setCenter(width/2, height/2);
	this.setTime(2, enchant.Easing.QUAD_EASEIN);
	this.inout='out';
	
	this.addChild(this._sprite);
	this.addEventListener('addedtoscene', addedToScene);
	this.addEventListener('enterframe', main);

}

function setColor(r, g, b, a){
	context.fillStyle = color(r||0, g||0, b||0, a||1.0);
}

function setCenter(x, y){
	this._irisX=x;
	this._irisY=y;
	if( this.scene ){
		addedToScene.call(this);
	}
		
}

function restart(){
	this._age=0;
}

function setTime(t, easing){
	this._irisTime=t*this._fps;
	if( easing ){
		this._easing=easing;
	}
}

function color(r, g, b, a){
	return 'rgba('+r+','+g+','+b+','+a+')';
}

function addedToScene(){
	this.width=this.scene.width;
	this.height=this.scene.height;
	
	var width = Math.max(this._irisX, this.width-this._irisX);
	var height = Math.max(this._irisY, this.height-this._irisY);
	this._irisR=Math.sqrt( Math.pow(width, 2) + Math.pow(height, 2) );
}

function main(){
	
	this._age++;
	if( this._age<=this._irisTime ){

		var r=this._easing( this._age, 0, this._irisR, this._irisTime );
		if( this._irisIo==='out' ){
			r=this._irisR - r;
		}
		var ctx=context;
		
		ctx.globalCompositeOperation='source-over';
		ctx.fillRect(0, 0, this.width, this.height);
		
		ctx.globalCompositeOperation='destination-out';
		ctx.beginPath();
		ctx.arc(this._irisX, this._irisY, r, 0, Math.PI*2, false);
		ctx.fill();
		
	}else{
		if( this._irisRemove ){
			this.scene.removeChild(this);
		}
	}

}

enchant.dab.Iris = enchant.Class.create(enchant.Group, {
	initialize: initialize,
	setColor: setColor,
	setCenter: setCenter,
	setTime: setTime,
	restart: restart,
	inout: {
		get: function(){
			return this._irisIo;
		},
		set: function(io){
			this._irisIo=io;
		}
	},
	toRemove: {
		get: function(){
			return this._irisRemove;
		},
		set: function(m){
			this._irisRemove=m;
		}
	}
});


})();
