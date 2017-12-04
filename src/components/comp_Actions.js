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
			hideTip('buyChicken');
			return 'Bought ' + chick.name;
		},
	},
	{
		name: 'clean',
		title: 'Clean floor',
		perTile: true,
		canStart: function(col, row, tile) {
			return tile.filth > 0;
		},
		start: function(col, row, tile) {
			tile.setFilth(Math.max(0, tile.filth - params.cleanFilthAmount));
			if (tile.filth == 0) {
				hideTip('cleaning');
				hideTip('moreCleaning');
				hideTip('unhappyChicken');
			}
			return tile.filth > 0 ? 'Cleaning' : 'Clean!';
		},
	},
	{
		name: 'food',
		title: 'Fill feeder',
		cost: 10,
		perTile: true,
		canStart: function(col, row, tile) {
			return tile.block && tile.block.has('Feeder');
		},
		start: function(col, row, tile) {
			if (!tile.block.refill) {
				return null;
			}
			tile.block.refill();
			hideTip('buyFood');
			return 'Filled feeder';
		},
	},
	{
		name: 'fence',
		title: 'Build fence',
		cost: 1,
		perTile: true,
		canStart: function(col, row, tile) {
			return tile.owned && !tile.block;
		},
		start: function(col, row, tile) {
			tile.block = Crafty.e('2D, Wall')._Wall(col, row);
			tile.block.matchAndFixNeighbors(col, row);
			hideTip('buyFence');
			return 'Built fence';
		},
	},
	{
		name: 'gate',
		title: 'Build gate',
		cost: 10,
		perTile: true,
		canStart: function(col, row, tile) {
			return tile.owned && !tile.block;
		},
		start: function(col, row, tile) {
			tile.block = Crafty.e('2D, Wall, Gate, Delay')._Wall(col, row);
			tile.block.matchAndFixNeighbors(col, row);
			hideTip('buyFence');
			return 'Built gate';
		},
	},
	{
		name: 'feeder',
		title: 'Build feeder',
		cost: 50,
		perTile: true,
		canStart: function(col, row, tile) {
			return tile.owned && !tile.block;
		},
		start: function(col, row, tile) {
			tile.block = Crafty.e('2D, Feeder')._Feeder(col, row);
			return 'Built feeder';
		},
	},
	{
		name: 'land',
		title: 'Rent land',
		cost: 5,
		perTile: true,
		canStart: function(col, row, tile) {
			return tile.forSale && !tile.owned;
		},
		start: function(col, row, tile) {
			tile.owned = true;
			updateLand();
			return 'Rented land';
		},
	},
	{
		name: 'sell',
		title: 'Sell object',
		perTile: true,
		canStart: function(col, row, tile) {
			var block = tile.block;
			if (!block) {
				return false;
			}
			for (var i = 0; i < sellables.length; i++) {
				if (block.has(sellables[i].comp)) {
					return true;
				}
			}
			return false;
		},
		start: function(col, row, tile) {
			var block = tile.block;
			if (!block) {
				return;
			}
			for (var i = 0; i < sellables.length; i++) {
				var sellable = sellables[i];
				if (block.has(sellable.comp)) {
					if (block.has('Wall')) {
						block.removeComponent('Wall');
						block.matchAndFixNeighbors(col, row);
					}
					block.destroy();
					tileMatrix[col][row].block = null;
					this.earnMoney(sellable.price, sellable.text);
				}
			}
		},
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

var sellables = [
	{comp: 'Gate', price: actions.gate.cost / 2, text: 'Sold gate'},
	{comp: 'Wall', price: actions.fence.cost / 2, text: 'Sold fence'},
	{comp: 'Feeder', price: actions.feeder.cost / 2, text: 'Sold feeder'},
];

Crafty.c('Actions', {

	init: function() {
		this.initHotbar();
		this.selectAction('chicken');
		this.interactPoint = {x: 0, y: 0};

		this.highlightTile = Crafty.e("2D, WebGL, Sprite, highlightYes")
				.attr({x: this.interactPoint.x, y: this.interactPoint.y, w: tileSize, h: tileSize})
				.sprite("highlightYes");
		this.interactIndicator = Crafty.e("2D, WebGL, highlightYes")
				.attr({x: this.interactPoint.x, y: this.interactPoint.y, w: params.indicatorSize, h: params.indicatorSize})
				.sprite("highlightYes");

		this.bind('EnterFrame', function(timestep) {
			this.updateInteractIndicator();
		});
	},

	updateInteractIndicator() {
		this.interactPoint = {x: 0, y: 0};
		var dir = this.direction;
		if (dir == "left") {
			this.interactPoint.x = this.originX() - params.interactDist;
			this.interactPoint.y = this.originY()-10;
			this.grabArea.x = -params.grabReach + this.originX() - 0.5 * params.grabAreaSize;
			this.grabArea.y = this.originY() - 0.5 * params.grabAreaSize;
		} else if (dir == "right") {
			this.interactPoint.x = this.originX() + params.interactDist;
			this.interactPoint.y = this.originY()-10;
			this.interactIndicator.x = this.interactPoint.x; 
			this.interactIndicator.y = this.interactPoint.y;
			this.grabArea.x = params.grabReach + this.originX() - 0.5 * params.grabAreaSize;
			this.grabArea.y = this.originY() - 0.5 * params.grabAreaSize;
		} else if (dir == "up") {
			this.interactPoint.x = this.originX();
			this.interactPoint.y = this.originY() - params.interactDist;
			this.grabArea.x = this.originX() - 0.5 * params.grabAreaSize;
			this.grabArea.y = -params.grabReach + this.originY() - 0.5 * params.grabAreaSize;
		} else if (dir == "down") {
			this.interactPoint.x = this.originX();
			this.interactPoint.y = this.originY() + params.interactDist;
			this.grabArea.x = this.originX() - 0.5 * params.grabAreaSize;
			this.grabArea.y = params.grabReach + this.originY() - 0.5 * params.grabAreaSize;
		}
		this.interactIndicator.x = this.interactPoint.x - params.indicatorSize / 2; 
		this.interactIndicator.y = this.interactPoint.y - params.indicatorSize / 2;

		// outline tile with which the player would now interact if she pressed the action button
		if (this.selectedAction.perTile) {
			var tileX = Math.floor(this.interactPoint.x / tileSize);
			var tileY = Math.floor(this.interactPoint.y / tileSize);
			var tile = getTile(tileX, tileY);
			this.highlightTile.x = tileX * tileSize;
			this.highlightTile.y = tileY * tileSize;
			this.highlightTile.z = zLevels['background' + this.highlightTile.y];
			this.highlightTile.visible = true;
			this.interactIndicator.visible = false;
			if (!this.selectedAction.canStart || this.selectedAction.canStart(tileX, tileY, tile)) {
				this.highlightTile.sprite("highlightYes");
			} else {
				this.highlightTile.sprite("highlightNo");
			}
			//Crafty.e("2D, WebGL, Color").attr({x: tileX * tileSize, y: tileY * tileSize, w: tileSize, h: tileSize, z: 10000}).color('purple');
		} else {
			this.interactIndicator.visible = true;
			this.highlightTile.visible = false;
		}
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
			var tile = getTile(col, row);
			if (!action.canStart || action.canStart(col, row, tile)) { // tile is not already blocked
				ret = action.start.call(this, col, row, tile);
			}
		} else {
			ret = action.start.call(this, this.interactPoint.x, this.interactPoint.y);
		}
		if (ret) {
			if (action.cost) {
				this.payMoney(action.cost, ret);
			} else {
				showPopup(this.x + this.w / 2, this.y + this.h / 2, ret, '#eee');
			}
		}
	},

	stopAction: function() {
		var action = this.selectedAction;
		if (action.stop) {
			action.stop.call(this);
		}
	},
});
