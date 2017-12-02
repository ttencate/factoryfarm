var overlay;
var bgMusic = null;

// MAIN SCENE
Crafty.scene('Main', function() {
	Crafty.timer.FPS(60);
	
	if (!bgMusic) {
		bgMusic = Crafty.audio.play('bgMusic',-1,0.3);
		if(mutemusic && bgMusic.source){
			bgMusic.pause();
		}
		
	}
	
	buildLevel = function(){
		Crafty.e('2D, Canvas, Color').color('red').attr({x: 50, y: 50, w: 50, h: 50});
	}

	buildLevel();
});

