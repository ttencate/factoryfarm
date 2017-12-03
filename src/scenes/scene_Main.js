var overlay;
var bgMusic = null;
var globalGrimness = 0;
var tileMatrix;

function getTile(col, row) {
	if (col < 0 || col >= tileMatrix.length) {
		return {};
	}
	var arr = tileMatrix[col];
	if (row < 0 || row >= arr.length) {
		return {};
	}
	return arr[row];
}

// MAIN SCENE
Crafty.scene('Main', function() {
  document.getElementById('info').style.visibility = 'visible';

	var colorGradingShader = new Crafty.WebGLShader(
		document.getElementById('vertex-shader').innerText,
		document.getElementById('fragment-shader').innerText,
		[
			{ name: "aPosition",     width: 2 },
			{ name: "aOrientation",  width: 3 },
			{ name: "aLayer",        width: 2 },
			{ name: "aTextureCoord", width: 2 },
			{ name: "aGrimness",     width: 2 }
		],
		function(e, entity) {
			var co = e.co;
			// Write texture coordinates
			e.program.writeVector("aTextureCoord",
				co.x, co.y,
				co.x, co.y + co.h,
				co.x + co.w, co.y,
				co.x + co.w, co.y + co.h
			);
			// Write our grayscale attribute
			var grimness = (globalGrimness + (entity.grimness || 0)) * (1.0 - (entity.ignoreGrimness || 0));
			e.program.writeVector("aGrimness", grimness, 0.0);
		}
	);
	Crafty.defaultShader('Sprite', colorGradingShader);

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
		ownedLayer = null;

		for (var i = level.layers.length - 1; i >= 0; i--) {
			var layer = level.layers[i];
			if (layer.name === "walls") {
				solidLayer = layer;
			} else if (layer.name === "grass") {
				grassLayer = layer;
			} else if (layer.name === "spawn") {
				spawnLayer = layer;
			} else if (layer.name === "owned") {
				ownedLayer = layer;
			}
		}
		
		// draw background grass
		var grasses = grassLayer.objects;
		for (var i = grasses.length - 1; i >= 0; i--) {
			var grass = grasses[i];
			Crafty.e('2D, WebGL, Sprite, grass').attr({x: grass.x, y: grass.y - grass.height, w: grass.width, h: grass.height});
		}

		tileMatrix = [];
		// draw all the tiles
		for (var col = 0; col < level.width; ++col) {
			tileMatrix[col] = [];
			for (var row = 0; row < level.height; ++row) {
				var linearIndex = level.width * row + col;
				tileMatrix[col][row] = {block: null, owned: false};
				tileIdx = solidLayer.data[linearIndex];
				// add impassable items
				if (tileIdx === 6) {
					tileMatrix[col][row].block = Crafty.e('2D, Feeder')._Feeder(col, row);
				} else if (tileIdx > 0) {
					tileMatrix[col][row].block = Crafty.e('2D, Wall')._Wall(col, row);//.attr({
						// tileIdx: tileIdx
					//});
				}
				if (ownedLayer.data[linearIndex]) {
					tileMatrix[col][row].owned = true;
				}
			};
		};
		Crafty("Wall").each(function(){
			if (this.matchNeighbors) {
				this.matchNeighbors();
			}
		})

		var seller = Crafty.e('Seller')._Seller(16, 15);

		// spawn living entities
		var spawns = spawnLayer.objects;
		for (var i = spawns.length - 1; i >= 0; i--) {
			var spawn = spawns[i];
			var properties = spawn.properties || {};
			var x = spawn.x + spawn.width / 2;
			var y = spawn.y + spawn.height / 2;
			switch (spawn.type) {
				case 'Chicken':
					var chicken = Crafty.e('2D, WebGL, chicken_down, Moving, Collision, Chicken, SpriteAnimation, ReelFromVelocity')
							.attr({x: x - 16, y: y - 16, w: 32, h: 32, z: zLevels['chicken']})
							.reel('walking_down', 500, [[0, 0], [1, 0], [2, 0], [3, 0]])
							.reel('walking_up', 500, [[0, 1], [1, 1], [2, 1], [3, 1]])
							.reel('walking_right', 500, [[0, 2], [1, 2], [2, 2], [3, 2]])
							.reel('walking_left', 500, [[0, 3], [1, 3], [2, 3], [3, 3]])
							.animate('walking_down', 0)
							._Chicken()
							._Moving();
					chicken.age = properties.age || 0;
					break;
				case 'Farmer':
					player = Crafty.e('2D, WebGL, farmer_down, KeyControls, Moving, Collision, SpriteAnimation, ReelFromVelocity, OriginCoordinates')
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
					// player.ignoreGrimness = 1.0;
					Crafty.viewport.follow(player);
					break;
			}
		}

		Crafty.viewport.clampToEntities = false;

		updateLandMarkers();
	}

	buildLevel();
});

function updateLandMarkers() {
	for (var col = 0; col < tileMatrix.length; ++col) {
		for (var row = 0; row < tileMatrix[col].length; ++row) {
			var tile = getTile(col, row);
			var owned = !!tile.owned;
			var needMarker =
					owned !== !!getTile(col-1, row).owned ||
					owned !== !!getTile(col, row-1).owned ||
					owned !== !!getTile(col-1, row).owned ||
					owned !== !!getTile(col-1, row-1).owned;
			if (tile.landMarker && !needMarker) {
				tile.landMarker.destroy();
				tile.landMarker = null;
			} else if (!tile.landMarker && needMarker) {
				var x = 64 * col - 11;
				var y = 64 * row - 24;
				var z = zLevels['markers'] + y;
				tile.landMarker = Crafty.e('2D, WebGL, Sprite, marker')
						.attr({x: x, y: y, z: z, w: 32, h: 32});
			}
		}
	}
}
