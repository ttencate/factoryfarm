var mutemusic = false;//false;
var mutesound = false;
var debug = false;//true;
var playing = false;
var fontFamily1  = "Alegreya SC"; // explanation text 
var fontFamily2 = "Cinzel"; // help text
var fontFamily3 = "Bungee Outline"; // title?

Crafty.paths({
	audio: 'assets/sound/',
	images: 'assets/images/'
});

Game = {
	width: function() {
		return window.innerWidth;
	},

	height: function() {
		return window.innerHeight;
	},
    
	start: function() {
		// Start crafty and set a background color so that we can see it's working
		Crafty.init();
		Crafty.timer.FPS(60);
		Crafty.timer.steptype('semifixed', 50);
    //Crafty.viewport.zoom(20,0,0,100);
    //Crafty.pixelart(true);
		Crafty.scene('Loading');
	},
};
