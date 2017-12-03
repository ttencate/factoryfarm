"use strict";

Crafty.c('KeyControls', {
	goingLeft: false,
	goingRight: false,
	goingUp: false,
	goingDown: false,
	money: 100,

	init: function() {
		this.baseZ = zLevels['player'];

		this.moneyText = document.getElementById('moneyText');
		this.chickensText = document.getElementById('chickensText');
		this.chickenPopup = document.getElementById('chickenPopup');
		this.setMoney(100);

		// acceleration
		this.acc = 0.005;
		this.drag = 0.01;
		this.minSpeed = 8 / 1000; // px per ms
		this.maxSpeed = 256 / 1000; // px per ms
 
 		this.interactPoint = {x: 0, y: 0}
		this.grabArea = Crafty.e("2D, WebGL, Collision")
				.attr({x: 0, y: 0, w: params.grabAreaSize, h: params.grabAreaSize, z: zLevels["player"]});
		this.attach(this.grabArea);
		this.numSelections = 3;
		this.select(1);

		this.highlightTile = Crafty.e("2D, WebGL, highlightYes")
				.attr({x: this.interactPoint.x, y: this.interactPoint.y, w: tileSize, h: tileSize})
				.sprite("highlightYes");

		this.bind('KeyDown', function(keyEvent) {
			var k = keyEvent.key;
			if (k === Crafty.keys.F7) { // cheat for debugging
				this.setMoney(this.money + 1000);
			} else if (k === this.up ) {
				this.goingUp = true;
			} else if (k === this.down) {
				this.goingDown = true;
			} else if (k === this.left) {
				this.goingLeft = true;
			} else if (k === this.right) {
				this.goingRight = true;
			} else if (k === this.action) {
				if (this.selected === 1 && this.money > 30) { // spawn
					this.setMoney(this.money - 30);
					Crafty.e('2D, WebGL, Sprite, chicken_down, Moving, Collision, Chicken, SpriteAnimation, ReelFromVelocity')
						.reel('walking_down', 500, [[0, 0], [1, 0], [2, 0], [3, 0]])
						.reel('walking_up', 500, [[0, 1], [1, 1], [2, 1], [3, 1]])
						.reel('walking_right', 500, [[0, 2], [1, 2], [2, 2], [3, 2]])
						.reel('walking_left', 500, [[0, 3], [1, 3], [2, 3], [3, 3]])
						.animate('walking_down', 0)
						.attr({x: this._x, y: this._y, w: 32, h: 32, z: zLevels['chicken']})
						._Chicken()
						._Moving();
				} else if (this.selected === 2 || this.selected === 3) {
					// determine nearest tile
					var col = Math.floor(this.interactPoint.x / tileSize);
					var row = Math.floor(this.interactPoint.y / tileSize);
					if (tileMatrix[col] && tileMatrix[col][row]) { // consider only tiles in bounds of tileMatrix
						if (!tileMatrix[col][row].block) { // tile is not already blocked
							if (this.selected === 2 && this.money > 4) { // build fence
								this.setMoney(this.money - 4);
								tileMatrix[col][row].block = Crafty.e('2D, Wall')._Wall(col, row);
								tileMatrix[col][row].block.matchAndFixNeighbors(col, row);
							} else if (this.selected === 3 && this.money > 55) { // place feeder
								this.setMoney(this.money - 55);
								tileMatrix[col][row].block = Crafty.e('2D, Feeder')._Feeder(col, row);
							}
						}
					}
				}
			} else if (k === this.grab) { // grab chicken/item
				// check if "grab" area hits chicken. OLD IDEA: First position it correctly
				// 1. if the farmer has non-zero speed, position it in the forward direction
				// 2. if zero speed, position it in front of the farmer, based on the sprite
				if (Math.abs(this.vx) > 0 || Math.abs(this.vy) > 0) {
					// var polar = utility.car2pol(this.vx, this.vy);
					// this.grabArea.x = Math.cos(polar.phi) * params.grabReach + this.originX() - 0.5 * params.grabAreaSize;
					// this.grabArea.y = Math.sin(polar.phi) * params.grabReach + this.originY() - 0.5 * params.grabAreaSize;
					// this.grabArea.rotation = Math.rad2deg(polar.phi);
					var grabbed = this.grabArea.hit("Chicken");
					if (grabbed) {
						grabbed[0].obj.isGrabbed = true;
						this.grabbed = grabbed[0].obj;
						this.updateChickenPopup(this.grabbed);
					}
				}
			} else if (k >= Crafty.keys['1'] && k < Crafty.keys['1'] + this.numSelections) {
				this.select(k - Crafty.keys['1'] + 1);
			}
		});
		this.bind('KeyUp', function(keyEvent) {
			var k = keyEvent.key;
			if (k === this.up ) {
				this.goingUp = false;
			} else if (k === this.down) {
				this.goingDown = false;
			} else if (k === this.left) {
				this.goingLeft = false;
			} else if (k === this.right) {
				this.goingRight = false;
			} else if (k === this.grab) {
				if (this.grabbed) {
					var chopCollisions;
					if (chopCollisions = this.grabbed.hit("ChopArea")) {
						if (this.grabbed.has("Chicken")) {
							chopCollisions[0].obj._parent.animate();
							player.setMoney(player.money + 0.01 * Math.round(3500 + Math.random() * 10));
							this.grabbed.destroy();
						}
					}
					this.grabbed.isGrabbed = false;
					this.grabbed = null;
					this.updateChickenPopup(null);
				}
			}
		});

		this.bind('EnterFrame', function(timestep){
			this.updateVelocity(timestep.dt);
			this.interactPoint = {x: 0, y: 0}
			var dir = this.reel();
			if (dir == "walking_left") {
				this.interactPoint.x = this.originX() - params.interactDist;
				this.interactPoint.y = this.originY()-20;
				this.grabArea.x = -params.grabReach + this.originX() - 0.5 * params.grabAreaSize;
				this.grabArea.y = this.originY() - 0.5 * params.grabAreaSize;
			} else if (dir == "walking_right") {
				this.interactPoint.x = this.originX() + params.interactDist;
				this.interactPoint.y = this.originY()-20;
				this.grabArea.x = params.grabReach + this.originX() - 0.5 * params.grabAreaSize;
				this.grabArea.y = this.originY() - 0.5 * params.grabAreaSize;
			} else if (dir == "walking_up") {
				this.interactPoint.x = this.originX();
				this.interactPoint.y = this.originY() - params.interactDist;
				this.grabArea.x = this.originX() - 0.5 * params.grabAreaSize;
				this.grabArea.y = -params.grabReach + this.originY() - 0.5 * params.grabAreaSize;
			} else if (dir == "walking_down") {
				this.interactPoint.x = this.originX()
				this.interactPoint.y = this.originY() + params.interactDist;
				this.grabArea.x = this.originX() - 0.5 * params.grabAreaSize;
				this.grabArea.y = params.grabReach + this.originY() - 0.5 * params.grabAreaSize;
			}
			// outline tile with which the player would now interact if she pressed the action button
			if (this.selected === 2 || this.selected === 3) {
				var tileX = Math.floor(this.interactPoint.x / tileSize);
				var tileY = Math.floor(this.interactPoint.y / tileSize);
				var tile = tileMatrix[tileX][tileY];
				this.highlightTile.x = tileX * tileSize;
				this.highlightTile.y = tileY * tileSize;
				this.highlightTile.z = zLevels['background' + this.highlightTile.y];
				//Crafty.e("2D, WebGL, Color").attr({x: tileX * tileSize, y: tileY * tileSize, w: tileSize, h: tileSize, z: 10000}).color('purple');
			}

			if (this.grabbed) {
				// determine location of the grabbed item
				var grabX = null;
				var grabY = null;
				// if (this.vx > 0 || this.vy > 0) {
				// 	var polar = utility.car2pol(this.vx, this.vy);
				// 	grabX = Math.cos(polar.phi) * params.grabReach + this.originX() - 0.5 * this.grabbed._w;
				// 	grabY = Math.sin(polar.phi) * params.grabReach + (this._y + 20) - 0.5 * this.grabbed._h;
				// } else {
					if (dir == "walking_left") {
						grabX = -15 + this.originX() - 0.5 * this.grabbed._w;
						grabY = (this._y + 35) - 0.5 * this.grabbed._h;
					} else if (dir == "walking_right") {
						grabX = 15 + this.originX() - 0.5 * this.grabbed._w;
						grabY = (this._y + 35) - 0.5 * this.grabbed._h;
					} else if (dir == "walking_up") {
						grabX = this.originX() - 0.5 * this.grabbed._w;
						grabY = -10 + (this._y + 20) - 0.5 * this.grabbed._h;
					} else if (dir == "walking_down") {
						grabX = this.originX() - 0.5 * this.grabbed._w;
						grabY = 20 + (this._y + 20) - 0.5 * this.grabbed._h;
					}
				// }
				if (!grabX || !grabY) {
					console.log("error: no grabs defined");
				}
				this.grabbed.rx = grabX;
				this.grabbed.ry = grabY;
			}
			this.updateChickensText();
		});
	},

	_KeyControls: function(left, right, up, down, action, grab) {
		this.left = left;
		this.right = right;
		this.up = up;
		this.down = down;
    this.action = action;
		this.grab = grab;
		return this;
	},

	updateVelocity: function(dt) {
		if (this.goingUp)
			this.vy -= this.acc * dt;
		if (this.goingDown)
			this.vy += this.acc * dt;
		if (this.goingLeft)
			this.vx -= this.acc * dt;
		if (this.goingRight)
			this.vx += this.acc * dt;
		// console.log('vx: ' + this.vx)
		this.vx *= Math.pow(1 - this.drag, dt);
		this.vy *= Math.pow(1 - this.drag, dt);
		var speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
		if (speed > this.maxSpeed) {
			var speedFactor = this.maxSpeed / speed;
			this.vx *= speedFactor;
			this.vy *= speedFactor;
		}
		if (speed < this.minSpeed && !this.goingLeft && !this.goingRight && !this.goingUp && !this.goingDown) {
			this.vx = 0;
			this.vy = 0;
		}
	},

	setMoney: function(money) {
		this.money = money;
		this.moneyText.innerText = '$' + this.money;
	},

	updateChickensText: function() {
		var numChickens = Crafty('Chicken').length;
		this.chickensText.innerText = numChickens + ' chicken' + (numChickens == 1 ? '' : 's');
		var minGrimnessAt = 4;
		var maxGrimnessAt = 14;
		globalGrimness = Math.max(0.0, Math.min(1.0, (numChickens - minGrimnessAt) / (maxGrimnessAt - minGrimnessAt)));
	},

	updateChickenPopup: function(chicken) {
		if (!chicken) {
			this.chickenPopup.style.visibility = 'hidden';
			return;
		}
		this.chickenPopup.style.visibility = 'visible';
		var html = '<dl>';
		html += '<dt>Happiness</dt><dd>' + heartString(chicken.happy) + '</dd>';
		html += '<dt>Fed</dt><dd>' + Math.round(chicken.fed) + '%</dd>';
		html += '<dt>Age</dt><dd>' + Math.floor(chicken.age) + ' years</dd>';
		html += '</dl>';
		this.chickenPopup.innerHTML = html;
	},

	select: function(selected) {
		this.selected = selected;
		var items = document.getElementsByClassName('hotbar-item');
		var activeItemId = 'hotbar-item-' + selected;
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.id === activeItemId) {
				item.classList.add('active');
			} else {
				item.classList.remove('active');
			}
		}
	},
});

function heartString(percentage) {
	var html = '';
	for (var h = 20; h <= 100; h += 20) {
		if (percentage >= h) {
			html += '<i class="icon heart-full"></i>';
		} else {
			html += '<i class="icon heart-empty"></i>';
		}
	}
	return html;
}
