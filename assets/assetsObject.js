var assetsObject = {
	"audio": {
		"bgmusic": ["bgmusic.mp3", "bgmusic.ogg"],
		"pok1": ["pok1.mp3"],
		"pok2": ["pok2.mp3"],
		"pok3": ["pok3.mp3"],
		"pickup": ["pickup.mp3"],
		"gate_open": ["gate_open.mp3"],
		"gate_close": ["gate_close.mp3"],
		"chop": ["chop.mp3"],
		"drop1": ["drop1.mp3"],
		"drop2": ["drop2.mp3"],
		"hungry": ["hungry.mp3"],
		"unhappy": ["unhappy.mp3"],
		"hammer": ["hammer.mp3"],
		"kaching": ["kaching.mp3"],
		"metal_knock": ["metal_knock.mp3"],
		"natural_death": ["natural_death.mp3"],
		"refill": ["refill.mp3"],
		"saw": ["saw.mp3"],
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
				chicken_dead: [0, 4],
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
				filth: [6, 3],
			},
		},
		"marker.png": {
			tile: 32,
			tileh: 32,
			map: {
				marker: [0, 0],
			},
		},
		"icons.png": {
			tile: 32,
			tileh: 32,
			map: {
				iconRipe: [0, 0],
				iconOverripe: [1, 0],
			},
		},
		"house.png": {
			tile: 192,
			tileh: 256,
			map: {
				house: [0, 0],
			},
		}
	},
};
