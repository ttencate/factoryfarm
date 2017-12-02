"use strict";

Crafty.c('KeyControls', {
	goingLeft: false,
	goingRight: false,
	goingUp: false,
	goingDown: false,
	money: 100,

	init: function() {
		// acceleration
		this.acc = 0.005;
		this.drag = 0.02;
		this.selected = Crafty.keys['1'];

		this.bind('KeyDown', function(keyEvent) {
			var k = keyEvent.key;
			if (k === this.up ) {
				this.goingUp = true;
			} else if (k === this.down) {
				this.goingDown = true;
			} else if (k === this.left) {
				this.goingLeft = true;
			} else if (k === this.right) {
				this.goingRight = true;
			} else if (k === this.action) {
					console.log(this.selected + " is maybe " + Crafty.keys['1'])
				if (this.selected === Crafty.keys['1'] && this.money > 30) { // spawn
					this.money -= 30;
					Crafty.e('2D, WebGL, Sprite, chicken_down, Moving, Collision, Chicken, SpriteAnimation, ReelFromVelocity')
						.reel('walking_down', 500, [[0, 0], [1, 0], [2, 0], [3, 0]])
						.reel('walking_up', 500, [[0, 1], [1, 1], [2, 1], [3, 1]])
						.reel('walking_right', 500, [[0, 2], [1, 2], [2, 2], [3, 2]])
						.reel('walking_left', 500, [[0, 3], [1, 3], [2, 3], [3, 3]])
						.animate('walking_down', 0)
						.attr({x: this._x, y: this._y, w: 32, h: 32, z: zLevels['chicken']})
						.color('blue')
						._Chicken()
						._Moving();
				}
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
			}
		});

		this.bind('EnterFrame', function(timestep){
			this.updateVelocity(timestep.dt);
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
