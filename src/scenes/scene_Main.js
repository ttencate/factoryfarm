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
		bgLayer = null;

		for (var i = level.layers.length - 1; i >= 0; i--) {
			var layer = level.layers[i];
			if (layer.name === "Tile Layer 1") {
				solidLayer = layer;
			} else if (layer.name === "background") {
				bgLayer = layer;
			}
		}
		
		// draw all the tiles
		for (var row = 0; row < level.height; ++row) {
			for (var col = 0; col < level.width; ++col) {
				// create tile for platform layer
				tileIdx = solidLayer.data[level.width * row + col];
				if (tileIdx === 1) {

				} else if (tileIdx === 2) {
					Crafty.e('2D, Wall')._Wall(col, row).attr({
						z: zLevels['background'],
						tileIdx: tileIdx
					}).sprite((tileIdx - 1) % xTiles, Math.floor((tileIdx - 1) / xTiles));
				}
				// tileIdx = bgLayer.data[level.width * row + col];
				// if (tileIdx != 0) {
				// 	//Crafty.e('2D, Canvas, Background')._Background(col, row).sprite((tileIdx - 1) % xTiles, Math.floor((tileIdx - 1) / xTiles));
				// }
				
			};
		};

		player = Crafty.e('2D, WebGL, Color, KeyControls, Moving, Collision, SpriteAnimation')
				.color('red').attr({x: 800, y: 500, w: 50, h: 50, z: zLevels['player']})
				._Moving()
				._KeyControls(Crafty.keys.LEFT_ARROW, Crafty.keys.RIGHT_ARROW, Crafty.keys.UP_ARROW, Crafty.keys.DOWN_ARROW);
		Crafty.viewport.clampToEntities = false;
		Crafty.viewport.follow(player);

	}

	buildLevel();
});

