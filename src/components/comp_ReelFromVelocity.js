"use strict";

Crafty.c('ReelFromVelocity', {
	directionChangeCooldown: 0,

	init: function() {
		this.bind('EnterFrame', this.updateReel);
	},

	remove: function() {
		this.unbind('EnterFrame', this.updateReel);
	},

	updateReel: function(timestep) {
		var directionFromVelocity = this.directionFromVelocity();
		var direction = this.direction || directionFromVelocity;
		this.directionChangeCooldown--;
		if (direction && this.reelDirection !== direction && this.directionChangeCooldown <= 0) {
			this.animate('walking_' + direction, -1);
			this.reelDirection = direction;
			this.directionChangeCooldown = 5;
		} else if (!directionFromVelocity) {
			this.pauseAnimation();
			this.reelPosition(0);
			this.reelDirection = null;
		}
	},

	directionFromVelocity: function() {
		if (Math.abs(this.vx) + Math.abs(this.vy) > 0.01) {
			if (Math.abs(this.vx) > Math.abs(this.vy)) {
				if (this.vx > 0) {
					return 'right';
				} else {
					return 'left';
				}
			} else {
				if (this.vy > 0) {
					return 'down';
				} else {
					return 'up';
				}
			}
		} else {
			return null;
		}
	},
});
