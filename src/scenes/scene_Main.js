var overlay;
var bgMusic = null;
var wallTiles;

// MAIN SCENE
Crafty.scene('Main', function() {
  document.getElementById('info').style.visibility = 'visible';

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
		spawnLayer = null;

		for (var i = level.layers.length - 1; i >= 0; i--) {
			var layer = level.layers[i];
			if (layer.name === "walls") {
				solidLayer = layer;
			} else if (layer.name === "grass") {
				grassLayer = layer;
			} else if (layer.name === "spawn") {
				spawnLayer = layer;
			}
		}
		
		// draw background grass
		var grasses = grassLayer.objects;
		for (var i = grasses.length - 1; i >= 0; i--) {
			var grass = grasses[i];
			Crafty.e('2D, WebGL, Image').image("assets/images/grass.png").attr({x: grass.x, y: grass.y - grass.height, w: grass.width, h: grass.height});
		}

		wallTiles = [];
		// draw all the tiles
		for (var row = 0; row < level.height; ++row) {
			for (var col = 0; col < level.width; ++col) {
				if (!wallTiles[col]) {
					wallTiles[col] = [];
				}
				// create tile for platform layer
				tileIdx = solidLayer.data[level.width * row + col];
				if (tileIdx === 6) {
					wallTiles[col][row] = Crafty.e('2D, Feeder')._Feeder(col, row);
				} else if (tileIdx > 0) {
					wallTiles[col][row] = Crafty.e('2D, Wall')._Wall(col, row).attr({
						// tileIdx: tileIdx
					});//.sprite((tileIdx - 1) % xTiles, Math.floor((tileIdx - 1) / xTiles));
				}
			};
		};
		Crafty("Wall").each(function(){
			if (this.matchNeighbors) {
				this.matchNeighbors();
			}
		})

		// spawn living entities
		var spawns = spawnLayer.objects;
		for (var i = spawns.length - 1; i >= 0; i--) {
			var spawn = spawns[i];
			var x = spawn.x + spawn.width / 2;
			var y = spawn.y + spawn.height / 2;
			switch (spawn.type) {
				case 'Chicken':
					Crafty.e('2D, WebGL, Sprite, chicken_down, Moving, Collision, Chicken, SpriteAnimation, ReelFromVelocity')
							.attr({x: x - 16, y: y - 16, w: 32, h: 32, z: zLevels['chicken']})
							.reel('walking_down', 500, [[0, 0], [1, 0], [2, 0], [3, 0]])
							.reel('walking_up', 500, [[0, 1], [1, 1], [2, 1], [3, 1]])
							.reel('walking_right', 500, [[0, 2], [1, 2], [2, 2], [3, 2]])
							.reel('walking_left', 500, [[0, 3], [1, 3], [2, 3], [3, 3]])
							.animate('walking_down', 0)
							._Chicken()
							._Moving();
					break;
				case 'Farmer':
					player = Crafty.e('2D, WebGL, Sprite, farmer_down, KeyControls, Moving, Collision, SpriteAnimation, ReelFromVelocity, OriginCoordinates')
							.attr({x: x - 32, y: y - 32, w: 64, h: 64, z: zLevels['player']})
							.collision([15,47, 49,47, 49,59, 15,59])
							.reel('walking_down', 500, [[0, 0], [1, 0], [2, 0], [3, 0]])
							.reel('walking_up', 500, [[0, 1], [1, 1], [2, 1], [3, 1]])
							.reel('walking_right', 500, [[0, 2], [1, 2], [2, 2], [3, 2]])
							.reel('walking_left', 500, [[0, 3], [1, 3], [2, 3], [3, 3]])
							.animate('walking_down', 0)
							.origin(32,50)
							._Moving()
							._KeyControls(Crafty.keys.LEFT_ARROW, Crafty.keys.RIGHT_ARROW, Crafty.keys.UP_ARROW, Crafty.keys.DOWN_ARROW, Crafty.keys.SPACE, Crafty.keys.SHIFT);
					Crafty.viewport.follow(player);
					break;
			}
		}

		Crafty.viewport.clampToEntities = false;
	}

	buildLevel();
});

