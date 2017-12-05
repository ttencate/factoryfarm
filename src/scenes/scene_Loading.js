// LOADING SCENE
Crafty.scene('Loading', function() {
	// // Draw some text for the player to see in case the file
	// //  takes a noticeable amount of time to load

	//Crafty.background('url(assets/images/background1.png)');
    Crafty.background(mycolors.background);
	
	var text = Crafty.e('2D, DOM, Text')
		.attr({
			x: Crafty.viewport._width / 2 - 128,
			y: Crafty.viewport._height / 2 - 16,
			w: 256,
			h: 32,
			z: 8
		})
		.textFont({
			size: '24px',
			family: fontFamily1
		})
		.textColor('#ffffff')
		.textAlign('center')
		.css({
			'border-radius': '8px',
			'line-height': '32px',
		})
		.text('Loading... (0%)');
	Crafty.load(assetsObject,
		function() {
			//when loaded
			Crafty.sprite(64, 64, "assets/images/tileset.png", {
				tileset: [0,0],	
			});
			// levelIdx = 0;
			// Crafty.audio.play('bgmusic', -1, 1.0);
			Crafty.scene('Main');
		},

		function(e) { // onProgress
			text.text('Loading... (' + Math.round(e.percent) + '%)')
			//console.log(e);
		},

		function(e) {
			console.log('loading error', e);
		}
	);
    
});
