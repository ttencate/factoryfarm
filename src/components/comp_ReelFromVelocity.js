"use strict";

Crafty.c('ReelFromVelocity', {
	init: function() {
		this.bind('EnterFrame', this.updateReel);
	},

	remove: function() {
		this.unbind('EnterFrame', this.updateReel);
	},

	updateReel: function(timestep) {
		var directionFromVelocity = this.directionFromVelocity();
		var direction = this.direction || directionFromVelocity;
		if (direction && this.reelDirection !== direction) {
			this.animate('walking_' + direction, -1);
			this.reelDirection = direction;
		} else if (!directionFromVelocity) {
			this.pauseAnimation();
			this.reelPosition(0);
			this.reelDirection = null;
		}
	},

	directionFromVelocity: function() {
		if (this.vx || this.vy) {
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
