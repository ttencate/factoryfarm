var overlay;
var bgMusic = null;
var globalGrimness = 0;
var tileMatrix;
var tileSize;
var ownedTiles = 0;
var player;

function getTile(col, row) {
	if (!isFinite(col) || !isFinite(row)) {
		throw 'invalid coordinates: ' + col + ', ' + row;
	}
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
			// Write our grimness attribute
			var grimness = utility.clamp(0, 1, globalGrimness + (entity.grimness || 0)) * (1.0 - (entity.ignoreGrimness || 0));
			e.program.writeVector("aGrimness", grimness, 0.0);
		}
	);
	Crafty.defaultShader('Sprite', colorGradingShader);

	if (!bgMusic) {
		bgMusic = Crafty.audio.play('bgmusic',-1,1.0);
		if(mutemusic && bgMusic.source){
			bgMusic.pause();
		}
	}

	Crafty.e('Tutorial');

	var buildLevel = function(){
		
		var level = TileMaps["map"];
		var tileSets = level.tilesets;

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
		}

		var solidLayer = null;
		var pathsLayer = null;
		var grassLayer = null;
		var spawnLayer = null;
		var ownedLayer = null;

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
			} else if (layer.name === "paths") {
				pathsLayer = layer;
			}
		}
		
		// draw background grass
		var grasses = grassLayer.objects;
		for (var i = grasses.length - 1; i >= 0; i--) {
			var grass = grasses[i];
			Crafty.e('2D, WebGL, Sprite, grass').attr({x: grass.x, y: grass.y - grass.height, w: grass.width, h: grass.height});
		}

		// find tile properties from the tile set that contains this tile's gid (global id)
		function getTile(tileGid) {
			for (var i = 0; i < tileSets.length; i++) {
				var tileSet = tileSets[i];
				if (tileGid >= tileSet.firstgid && tileGid < tileSet.firstgid + tileSet.tilecount) {
					var tile = tileSet.tiles[tileGid - tileSet.firstgid];
					return tile || {};
				}
			}
			return {};
		}

		tileMatrix = [];
		// draw all the tiles
		for (var col = 0; col < level.width; ++col) {
			tileMatrix[col] = [];
			for (var row = 0; row < level.height; ++row) {
				var linearIndex = level.width * row + col;
				tileMatrix[col][row] = {
					block: null,
					owned: false,
					filth: 0,
					filthSprite: null,
					units: [],
					col: col,
					row: row,
					setFilth: function(filth){
						this.filth = filth;
						// console.log('filth to '+this.filth+' at '+this.filthSprite.x+", "+this.filthSprite.y);
						if (this.filth <= 0) {
							this.filth = 0;
							if (this.filthSprite) {
								this.filthSprite.destroy();
								this.filthSprite = null;
							}
						} else {
							showTip('cleaning');
							if (this.filth > 100) {
								showTip('moreCleaning');
							}
							if (!this.filthSprite) {
								this.filthSprite = Crafty.e('2D, WebGL, Sprite, filth')
									.attr({x: this.col * tileSize, y: this.row * tileSize, z: zLevels.filth + this.row * tileSize, w: tileSize, h: tileSize});
							}
							if (this.filth <= 20) {
								this.filthSprite.sprite(6,0);
							} else if (this.filth <= 50) {
								this.filthSprite.sprite(6,1);
							} else if (this.filth <= 100) {
								this.filthSprite.sprite(6,2);
							} else if (this.filth <= 150) { // disgusting!
								this.filthSprite.sprite(6,3);
							} else { // the ultimate grossness
								this.filthSprite.sprite(6,4);
							}
						}
					},
					pave: function() {
						if (this.paved) {
							return;
						}
						this.paved = true;
						this.floor = Crafty.e('2D, WebGL, Sprite, tileset')
								.attr({x: this.col * tileSize, y: this.row * tileSize, z: zLevels.floor + this.row * tileSize, w: tileSize, h: tileSize})
								.sprite(8, Math.floor(4 * Math.random()));
					},
					ssHappiness: function() {
						// calculate steady-state happiness in this location
						var ssHappy = 100; // base is perfectly happy.

						if (this.paved) {
							ssHappy -= params.pavedImpact; // don't like paved.
						}
						ssHappy -= params.filthImpact * this.filth; // filth makes chicken unhappy
						// account for crowdedness, get chicken on same tile
						ssHappy -= (this.units.length - 1) * params.crowdImpact;
						return ssHappy;
					}
				};

				var tileGid = solidLayer.data[linearIndex];
				var tileType = getTile(tileGid).type;

				// add impassable items
				if (tileType === 'Feeder') {
					tileMatrix[col][row].block = Crafty.e('2D, Feeder')._Feeder(col, row);
				} else if (tileType === 'Seller') {
					Crafty.e('Seller')._Seller(col, row);
				} else if (tileType === 'Fence') {
					tileMatrix[col][row].block = Crafty.e('2D, Wall')._Wall(col, row);//.attr({
						// tileGid: tileGid
					//});
				} else if (tileType === 'Gate') {
					tileMatrix[col][row].block = Crafty.e('2D, Wall, Gate, Delay')._Wall(col, row);//.attr({
				} else if (tileType === 'House') {
					Crafty.e('2D, WebGL, Sprite, house, Collision, Impassable')
						.attr({ x: col * tileSize, y: row * tileSize, z: row * tileSize + zLevels.house, w: 192, h: 256 })
						.collision([18,104, 174,104, 174,252, 18,252]);
				}

				var pathTile = pathsLayer.data[linearIndex];
				if (pathTile) {
					Crafty.e('2D, WebGL, Sprite, emptyTileSetTile')
						.attr({ x: col * tileSize, y: row * tileSize, z: row * tileSize + zLevels.paths, w: tileSize, h: tileSize })
						.sprite((pathTile - 1) % 10, Math.floor((pathTile - 1) / 10));
				}

				var ownedTile = getTile(ownedLayer.data[linearIndex]);
				tileMatrix[col][row].owned = ownedTile.type === 'Owned';
				tileMatrix[col][row].forSale = ownedTile.type !== 'NotForSale';
			}
		}
		Crafty("Wall").each(function(){
			if (this.matchNeighbors) {
				this.matchNeighbors();
			}
		});

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
							.reel('dead', 500, [[0, 4], [1, 4], [2, 4], [3, 4]])
							.animate('walking_down', 0)
							._Chicken()
							._Moving();
					chicken.ageMs = (properties.age || 0) * params.yearDurationMilliseconds;
					break;
				case 'Farmer':
					player = Crafty.e('2D, WebGL, farmer_down, Wallet, KeyControls, Actions, Moving, Collision, SpriteAnimation, ReelFromVelocity, OriginCoordinates, CanMoveThroughGates')
							.attr({x: x - 32, y: y - 32, w: 64, h: 64, z: zLevels['player']})
							.collision([15,47, 49,47, 49,59, 15,59])
							.reel('walking_down', 500, [[0, 0], [1, 0], [2, 0], [3, 0]])
							.reel('walking_up', 500, [[0, 1], [1, 1], [2, 1], [3, 1]])
							.reel('walking_right', 500, [[0, 2], [1, 2], [2, 2], [3, 2]])
							.reel('walking_left', 500, [[0, 3], [1, 3], [2, 3], [3, 3]])
							.animate('walking_down', 0)
							.origin(32,50)
							._Moving()
							._KeyControls(
								[Crafty.keys.LEFT_ARROW, Crafty.keys.A],
								[Crafty.keys.RIGHT_ARROW, Crafty.keys.D],
								[Crafty.keys.UP_ARROW, Crafty.keys.W],
								[Crafty.keys.DOWN_ARROW, Crafty.keys.S],
								[Crafty.keys.SPACE],
								[Crafty.keys.SHIFT]);
					// player.ignoreGrimness = 1.0;
					Crafty.viewport.follow(player);
					// Crafty.viewport.scale(1);
					break;
			}
		}

		Crafty.viewport.clampToEntities = false;

		Crafty.e('Calendar');

		updateLand();
	};

	buildLevel();
});

function updateLand() {
	ownedTiles = 0;
	for (var col = 0; col < tileMatrix.length; ++col) {
		for (var row = 0; row < tileMatrix[col].length; ++row) {
			var tile = getTile(col, row);
			var owned = !!tile.owned;
			if (owned) {
				++ownedTiles;
			}
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

	document.getElementById('rentText').innerText = utility.formatMoney(ownedTiles * params.rentPerTile);
}
