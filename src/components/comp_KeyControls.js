"use strict";

Crafty.c('KeyControls', {
	goingLeft: false,
	goingRight: false,
	goingUp: false,
	goingDown: false,

	init: function() {
		// acceleration
		this.acc = 0.003;

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

	_KeyControls: function(left, right, up, down, action) {
		this.left = left;
		this.right = right;
		this.up = up;
		this.down = down;
		this.action = action
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