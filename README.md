# NAME

enchant.dab.iris - Iris-in, Iris-out effect

# VERSION

version 1.2

# DESCRIPTION

![screenshot](http://home.wi-wi.jp/software/js_iris.enchant/images/iris-out.gif)

This is an animation effect.

Please see [Wicker Wings \[ja\]](http://home.wi-wi.jp/software/js_iris.enchant/) for more information.

# Constructor

 - new enchant.dab.Iris(width, height, fps):
 
 Width and height are the rectangle size which is surrounding the iris.
 
 Fps is the game-core's fps.
 
 You may ommit All arguments. When they are ommitted, the arguments will be as the game-core's options.
 
# Options

## Methods

- setCenter(x, y): the center of the iris' circle
- setColor(r, g, b, a): iris color and opacity
- setRadius(r): radius of the iris' circle
- setTime(time, easing): duration and easing function
- fillColor(r, g, b, a): iris color and opacity
- restart: restart or resume the animation
- resetCircle: reset the circle

## Properties

- inout: String: "in" for iris-in, "out" for iris-out. default: "out".
- toRemove: Boolean: if "true" is set, the sprite is removed from the scene. default: false.
- irisWait: Boolean: if "true" is set, the animation is stopped. default: false.
- width: Number:
- height: Number:
- touchEnabled: Boolean: To work 'touchstart', 'touchmove', 'touchend' Events. default: false.

```javascript
// export 'dab' to use "new Iris()".
// also you can use "use enchant()" and "new enchant.dab.Iris()"
enchant('dab');

window.onload=function(){

var game = new Game(320, 320);
game.fps=30;

game.onload=function(){
    
    // create instance of Iris
    var iris=new Iris(game.width, game.height, game.fps);
    
    // the effect will be set "iris-in"
    iris.inout="in";
    
    // sprite will be removed after finished the animation.
    iris.toRemove=true;
    
    // set the duration at 3 seconds and easing
    iris.setTime(3, enchant.Easing.SIN_EASEIN);
    
    game.rootScene.addChild(iris);
};

game.start();

}

```
