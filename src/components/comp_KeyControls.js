"use strict";

Crafty.c('KeyControls', {
	goingLeft: false,
	goingRight: false,
	goingUp: false,
	goingDown: false,
	money: 100,

	init: function() {
		this.baseZ = zLevels['player'];
		this.moneyDiv = document.getElementById('moneyText');

		// acceleration
		this.acc = 0.005;
		this.drag = 0.02;
		this.selected = Crafty.keys['1'];
		this.grabArea = Crafty.e("2D, Collision").attr({x: 0, y: 0, w: params.grabAreaSize, h: params.grabAreaSize, z: zLevels["player"]});
		this.attach(this.grabArea);

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
				console.log(this.select1 + ' and ' + this.selected);
				if (this.selected === this.select2 && this.money > 30) { // spawn
					this.money -= 30;
					Crafty.e('2D, WebGL, Sprite, chicken_down, Moving, Collision, Chicken, SpriteAnimation, ReelFromVelocity')
						.reel('walking_down', 500, [[0, 0], [1, 0], [2, 0], [3, 0]])
						.reel('walking_up', 500, [[0, 1], [1, 1], [2, 1], [3, 1]])
						.reel('walking_right', 500, [[0, 2], [1, 2], [2, 2], [3, 2]])
						.reel('walking_left', 500, [[0, 3], [1, 3], [2, 3], [3, 3]])
						.animate('walking_down', 0)
						.attr({x: this._x, y: this._y, w: 32, h: 32, z: zLevels['chicken']})
						._Chicken()
						._Moving();
				} else if (this.selected === this.select1) { // grab chicken
					// check if "grab" area hits chicken. First position it correctly
					// 1. if the farmer has non-zero speed, position it in the forward direction
					// 2. if zero speed, position it in front of the farmer, based on the sprite
					console.log('grab');
					if (Math.abs(this.vx) > 0 || Math.abs(this.vy) > 0) {
						var polar = utility.car2pol(this.vx, this.vy);
						this.grabArea.x = Math.cos(polar.phi) * params.grabReach + this.originX() - 0.5 * params.grabAreaSize;
						this.grabArea.y = Math.sin(polar.phi) * params.grabReach + this.originY() - 0.5 * params.grabAreaSize;
						// this.grabArea.rotation = Math.rad2deg(polar.phi);
						var grabbed = this.grabArea.hit("Chicken");
						if (grabbed) {
							grabbed[0].obj.grabbed = true;
							this.grabbed = grabbed[0].obj;
						}
					} else {

					}
				}
			} else if (k === this.select1) {
				this.selected = this.select1;
			} else if (k === this.select2) {
				this.selected = this.select2;
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
			if (this.grabbed) {
				// determine location of the grabbed item
				var grabX = null;
				var grabY = null;
				// if (this.vx > 0 || this.vy > 0) {
				// 	var polar = utility.car2pol(this.vx, this.vy);
				// 	grabX = Math.cos(polar.phi) * params.grabReach + this.originX() - 0.5 * this.grabbed._w;
				// 	grabY = Math.sin(polar.phi) * params.grabReach + (this._y + 20) - 0.5 * this.grabbed._h;
				// } else {
					var dir = this.reel();
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

	_KeyControls: function(left, right, up, down, action, select1, select2) {
		this.left = left;
		this.right = right;
		this.up = up;
		this.down = down;
		this.action = action;
		this.select1 = select1;
		this.select2 = select2;
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

});
