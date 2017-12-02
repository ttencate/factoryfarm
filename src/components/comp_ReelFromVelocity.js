"use strict";

Crafty.c('ReelFromVelocity', {
	init: function() {
		this.bind('EnterFrame', function(timestep) {
			this.updateReel();
		});
	},

	updateReel: function() {
		if (typeof this.vx !== 'number' && typeof this.vy !== 'number') {
			return;
		}
		var direction = null;
		if (this.vx || this.vy) {
			if (Math.abs(this.vx) > Math.abs(this.vy)) {
				if (this.vx > 0) {
					direction = 'right';
				} else {
					direction = 'left';
				}
			} else {
				if (this.vy > 0) {
					direction = 'down';
				} else {
					direction = 'up';
				}
			}
			if (this.direction != direction) {
				this.animate('walking_' + direction, -1);
				this.direction = direction;
			}
		} else {
			this.pauseAnimation();
			this.reelPosition(0);
		}
		this.direction = direction;
	},
});
