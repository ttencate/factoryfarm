var assetsObject = {
	"audio": {
		"bgmusic": ["bgmusic.mp3", "bgmusic.ogg"],
	},
	"sprites": {
		"farmer.png": {
			tile: 64,
			tileh: 64,
			map: {
				farmer_down: [0, 0],
				farmer_up: [0, 1],
				farmer_right: [0, 2],
				farmer_left: [0, 3],
			},
		},
		"chicken.png": {
			tile: 32,
			tileh: 32,
			map: {
				chicken_down: [0, 0],
				chicken_up: [0, 1],
				chicken_right: [0, 2],
				chicken_left: [0, 3],
			},
		},
		"grass.png": {
			tile: 1024,
			tileh: 1024,
			map: {
				grass: [0, 0],
			},
		},
		"seller.png": {
			tile: 128,
			tileh: 128,
			map: {
				seller: [0, 0],
			},
		},
		"tileset.png": {
			tile: 64,
			tileh: 64,
			map: {
				highlightYes: [0,2],
				highlightNo: [0,3],
			},
		},
		"marker.png": {
			tile: 32,
			tileh: 32,
			map: {
				marker: [0, 0],
			},
		},
	},
};
