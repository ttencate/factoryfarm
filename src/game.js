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
		return 800;
	},

	height: function() {
		return 600;
	},

    
    
	start: function() {
		// Start crafty and set a background color so that we can see it's working
		Crafty.init(Game.width(),Game.height(), 'cr-stage');
    //Crafty.viewport.zoom(20,0,0,100);
    //Crafty.pixelart(true);
		Crafty.scene('Loading');
	},
};