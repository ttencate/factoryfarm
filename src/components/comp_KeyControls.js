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
		this.updateMoneyText();

		// acceleration
		this.acc = 0.005;
		this.drag = 0.02;
 
 		this.interactPoint = {x: 0, y: 0}
		this.grabArea = Crafty.e("2D, WebGL, Collision").attr({x: 0, y: 0, w: params.grabAreaSize, h: params.grabAreaSize, z: zLevels["player"]});
		this.attach(this.grabArea);
		this.numSelections = 3;
		this.select(1);

		this.bind('KeyDown', function(keyEvent) {
			var k = keyEvent.key;
			if (k === this.up ) {
				console.log('going up now!');
				this.goingUp = true;
			} else if (k === this.down) {
				console.log('going down now!');
				this.goingDown = true;
			} else if (k === this.left) {
				console.log('going left');
				this.goingLeft = true;
			} else if (k === this.right) {
				console.log('going right');
				this.goingRight = true;
			} else if (k === this.action) {
				if (this.selected === 1 && this.money > 30) { // spawn
					this.money -= 30;
					this.updateMoneyText();
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
					if (wallTiles[col] && wallTiles[col][row] && wallTiles[col][row]) {
						// tile is blocked
					} else {
						if (this.selected === 2 && this.money > 4) { // build fence
							this.money -= 4;
							this.updateMoneyText();
							if (!wallTiles[col]) wallTiles[col] = [];
							wallTiles[col][row] = Crafty.e('2D, Wall')._Wall(col, row);
							wallTiles[col][row].matchAndFixNeighbors(col, row);
						} else if (this.selected === 3 && this.money > 55) { // place feeder
							this.money -= 55;
							this.updateMoneyText();
							wallTiles[col][row] = Crafty.e('2D, Feeder')._Feeder(col, row);
						}
					}
				} else if (this.selected === 4) { // grab chicken/item
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
							grabbed[0].obj.grabbed = true;
							this.grabbed = grabbed[0].obj;
						}
					} else {

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
			} else if (k === this.action) {
				if (this.grabbed) {
					this.grabbed.grabbed = false;
					this.grabbed = null;
				}
			}
		});

		this.bind('EnterFrame', function(timestep){
			this.updateVelocity(timestep.dt);
			this.interactPoint = {x: 0, y: 0}
			var dir = this.reel();
			if (dir == "walking_left") {
				this.interactPoint.x = this.originX() - params.interactDist;
				this.interactPoint.y = this.originY();
				this.grabArea.x = -params.grabReach + this.originX() - 0.5 * params.grabAreaSize;
				this.grabArea.y = this.originY() - 0.5 * params.grabAreaSize;
			} else if (dir == "walking_right") {
				this.interactPoint.x = this.originX() + params.interactDist;
				this.interactPoint.y = this.originY();
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
		});
	},

	_KeyControls: function(left, right, up, down, action) {
		this.left = left;
		this.right = right;
		this.up = up;
		this.down = down;
		this.action = action;
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
		this.vx -= this.drag * this.vx * dt;
		this.vy -= this.drag * this.vy * dt;
		if (utility.sign(this.vx) * this.vx < 0.1 && !this.goingLeft && !this.goingRight) {
			this.vx = 0;
		}
		if (utility.sign(this.vy) * this.vy < 0.1 && !this.goingUp && !this.goingDown) {
			this.vy = 0;
		}	
	},

	updateMoneyText: function() {
		this.moneyText.innerText = '$' + this.money;
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
