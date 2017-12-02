// LOADING SCENE
Crafty.scene('Loading', function() {
	// // Draw some text for the player to see in case the file
	// //  takes a noticeable amount of time to load

	//Crafty.background('url(assets/images/background1.png)');
    Crafty.background(mycolors.background);
	
	Crafty.e('2D, DOM, Text')
		.attr({
			x: 321,
			y: 188,
			w: 222,
			h: 200,
			z: 8
		})
		.textFont({
			size: '24px',
			family: fontFamily1
		})
		.css({
			'padding-top': '45px',
			'background-color': mycolors.textBlockBg,
			'border': ('2px dashed' + mycolors.button1),
			'border-radius': '8px',
			'cursor': 'pointer',
			'text-align': 'center',
			'padding-top': '3px',
			'color': mycolors.textBlockText,
		})
		.text('<BR><br>Loading,<br><BR> please wait...');
	Crafty.load(assetsObject,
		function() {
			//when loaded
			Crafty.sprite(64, 64, "assets/images/tileset.png", {
				tileset: [0,0],	
			});
			levelIdx = 0;
			Crafty.scene('Main');
		},

		function(e) { // onProgress
			//console.log(e);
		},

		function(e) {
			console.log('loading error');
			console.log(e);
		}
	);
    
    
    

});