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
		
		level = TileMaps["map"];
		tileSets = level.tilesets;

		// determine tile sizes
		var xTiles, yTiles;
		for (var i = tileSets.length - 1; i >= 0; i--) {
			var t = tileSets[i];
			if (t.name === "tileset") {
				// these are the real tiles; solid stuff, background etc.
				tileSize = t.tilewidth;
				xTiles = t.imagewidth / t.tilewidth;
				yTiles = t.imageheight / t.tileheight;
			}
		};

		solidLayer = null;
		grassLayer = null;

		for (var i = level.layers.length - 1; i >= 0; i--) {
			var layer = level.layers[i];
			if (layer.name === "walls") {
				solidLayer = layer;
			} else if (layer.name === "grass") {
				grassLayer = layer;
			}
		}
		
		// draw background grass
		var grasses = grassLayer.objects;
		for (var i = grasses.length - 1; i >= 0; i--) {
			var grass = grasses[i];
			Crafty.e('2D, WebGL, Image').image("assets/images/grass.png").attr({x: grass.x, y: grass.y - grass.height, w: grass.width, h: grass.height});
		} 

		// draw all the tiles
		for (var row = 0; row < level.height; ++row) {
			for (var col = 0; col < level.width; ++col) {
				// create tile for platform layer
				tileIdx = solidLayer.data[level.width * row + col];
				if (tileIdx === 1) {

				} else if (tileIdx > 0) {
					Crafty.e('2D, Wall')._Wall(col, row).attr({
						z: zLevels['background'],
						tileIdx: tileIdx
					}).sprite((tileIdx - 1) % xTiles, Math.floor((tileIdx - 1) / xTiles));
				}				
			};
		};

		player = Crafty.e('2D, WebGL, Sprite, farmer_down, KeyControls, Moving, Collision, SpriteAnimation, ReelFromVelocity')
				.attr({x: 800, y: 500, w: 64, h: 64, z: zLevels['player']})
				.collision([[19, 47], [47, 47], [47, 59], [19, 59]]) // Has no effect?
				.reel('walking_down', 500, [[0, 0], [1, 0], [2, 0], [3, 0]])
				.reel('walking_up', 500, [[0, 1], [1, 1], [2, 1], [3, 1]])
				.reel('walking_right', 500, [[0, 2], [1, 2], [2, 2], [3, 2]])
				.reel('walking_left', 500, [[0, 3], [1, 3], [2, 3], [3, 3]])
				.animate('walking_down', 0)
				._Moving()
				._KeyControls(Crafty.keys.LEFT_ARROW, Crafty.keys.RIGHT_ARROW, Crafty.keys.UP_ARROW, Crafty.keys.DOWN_ARROW, Crafty.keys.SPACE);
		Crafty.viewport.clampToEntities = false;
		Crafty.viewport.follow(player);

		chick = Crafty.e('2D, WebGL, Sprite, chicken_down, Moving, Collision, Chicken, SpriteAnimation, ReelFromVelocity')
				.attr({x: 800, y: 600, w: 32, h: 32, z: zLevels['chicken']})
				.reel('walking_down', 500, [[0, 0], [1, 0], [2, 0], [3, 0]])
				.reel('walking_up', 500, [[0, 1], [1, 1], [2, 1], [3, 1]])
				.reel('walking_right', 500, [[0, 2], [1, 2], [2, 2], [3, 2]])
				.reel('walking_left', 500, [[0, 3], [1, 3], [2, 3], [3, 3]])
				.animate('walking_down', 0)
				._Chicken()
				._Moving();

	}

	buildLevel();
});

