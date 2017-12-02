var overlay;
var bgMusic = null;

// MAIN SCENE
Crafty.scene('Main', function() {
	
	if (!bgMusic) {
		bgMusic = Crafty.audio.play('bgMusic',-1,0.3);
		if(mutemusic && bgMusic.source){
			bgMusic.pause();
		}
		
	}
	
	buildLevel = function(){
		Crafty.e('2D, WebGL, Color, KeyControls, Moving, Collision')
			.color('red').attr({x: 50, y: 50, w: 50, h: 50})
			._Moving()
			._KeyControls(Crafty.keys.LEFT_ARROW, Crafty.keys.RIGHT_ARROW, Crafty.keys.UP_ARROW, Crafty.keys.DOWN_ARROW);
	}

	buildLevel();
});

