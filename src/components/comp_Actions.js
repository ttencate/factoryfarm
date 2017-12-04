var indexedActions = [
	{
		name: 'chicken',
		title: 'Buy chicken',
		cost: 10,
		perTile: false,
		start: function(x, y) {
			var chickSize = 32;
			// var dir = this.reel();
			// xMod = dir === "walking_down" || dir === "walking_up" ? chickSize / 2 : 0;
			var chick = Crafty.e('2D, WebGL, Sprite, chicken_down, Moving, Collision, Chicken, SpriteAnimation, ReelFromVelocity')
				.reel('walking_down', 500, [[0, 0], [1, 0], [2, 0], [3, 0]])
				.reel('walking_up', 500, [[0, 1], [1, 1], [2, 1], [3, 1]])
				.reel('walking_right', 500, [[0, 2], [1, 2], [2, 2], [3, 2]])
				.reel('walking_left', 500, [[0, 3], [1, 3], [2, 3], [3, 3]])
				.animate('walking_down', 0)
				.attr({x: x - chickSize/2, y: y - chickSize/2, w: chickSize, h: chickSize, z: zLevels['chicken']})
				._Chicken()
				._Moving();
			return 'Bought ' + chick.name;
		},
	},
	{
		name: 'clean',
		title: 'Clean floor',
		perTile: true,
	},
	{
		name: 'fence',
		title: 'Build fence',
		cost: 1,
		perTile: true,
		needFreeTile: true,
		start: function(col, row) {
			tileMatrix[col][row].block = Crafty.e('2D, Wall')._Wall(col, row);
			tileMatrix[col][row].block.matchAndFixNeighbors(col, row);
			return 'Built fence';
		},
	},
	{
		name: 'gate',
		title: 'Build gate',
		cost: 10,
		perTile: true,
		needFreeTile: true,
	},
	{
		name: 'feeder',
		title: 'Build feeder',
		cost: 50,
		perTile: true,
		needFreeTile: true,
		start: function(col, row) {
			tileMatrix[col][row].block = Crafty.e('2D, Feeder')._Feeder(col, row);
			return 'Built feeder';
		},
	},
	{
		name: 'food',
		title: 'Fill feeder',
		cost: 20,
		perTile: true,
	},
	{
		name: 'land',
		title: 'Rent land',
		cost: 5,
		perTile: true,
	},
];

var actions = (function() {
	var actions = {};
	for (var i = 0; i < indexedActions.length; i++) {
		var action = indexedActions[i];
		actions[action.name] = action;
	}
	return actions;
})();

var actionsByKey = (function() {
	var actions = {};
	for (var i = 0; i < indexedActions.length; i++) {
		var action = indexedActions[i];
		action.key = (i + 1) % 10;
		actions[action.key] = action;
	}
	return actions;
})();

Crafty.c('Actions', {

	init: function() {
		this.initHotbar();
		this.selectAction('chicken');
	},

	initHotbar: function() {
		var html = '';
		for (var i = 0; i < indexedActions.length; i++) {
			var action = indexedActions[i];
			html += '<div class="hotbar-item" id="hotbar-item-' + action.name + '" title="' + action.title + '" onclick="Crafty(\'Actions\').selectAction(\'' + action.name + '\')">';
			html += '<span class="key">' + action.key + '</span>';
			if (action.cost) {
				html += '<span class="cost">' + utility.formatMoney(action.cost) + '</span>';
			}
			html += '</div> ';
		}
		document.getElementById('hotbar').innerHTML = html;
	},

	selectAction: function(actionName) {
		if (!actions[actionName]) return;
		this.selectedAction = actions[actionName];
		var items = document.getElementsByClassName('hotbar-item');
		var activeItemId = 'hotbar-item-' + actionName;
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.id === activeItemId) {
				item.classList.add('active');
			} else {
				item.classList.remove('active');
			}
		}
	},

	startAction: function() {
		var action = this.selectedAction;
		if (!action.start) {
			return;
		}
		if (action.cost && !this.canAfford(action.cost)) {
			return;
		}
		var ret;
		if (action.perTile) {
			// determine nearest tile
			var col = Math.floor(this.interactPoint.x / tileSize);
			var row = Math.floor(this.interactPoint.y / tileSize);
			if (tileMatrix[col] && tileMatrix[col][row]) { // consider only tiles in bounds of tileMatrix
				if (!action.needFreeTile || !tileMatrix[col][row].block) { // tile is not already blocked
					ret = action.start.call(this, col, row);
				}
			}
		} else {
			ret = action.start.call(this, this.interactPoint.x, this.interactPoint.y);
		}
		if (ret) {
			this.payMoney(action.cost, ret);
		}
	},

	stopAction: function() {
		var action = this.selectedAction;
		if (action.stop) {
			action.stop.call(this);
		}
	},
});
