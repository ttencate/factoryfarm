"use strict";

Crafty.c("Moving", {
	init: function(){
		this.requires("2D");
		this.vx = 0.0;
		this.vy = 0.0;
		this.bounce = 0;
	},

	_Moving: function() {
		if (!this.x || !this.y) {
			console.log("Warning, x and y not both defined before calling _Moving!");
		}
		this.rx = this._x;
		this.ry = this._y;
		this.bind("EnterFrame", function(timestep) {
			var dt = timestep.dt;
			var collisions
			if (collisions = this.moveCollisionTest()) { // if we're stuck, first get free
				this.rx += this.vx * dt;
				this.x = Math.round(this.rx);
				this.ry += this.vy * dt;
				this.y = Math.round(this.ry);
			} else {
				this.prevX = this.rx;
				this.rx += this.vx * dt;
				this.x = Math.round(this.rx);
				if (this.moveCollisionTest()) {
					this.vx *= this.bounce;
					this.rx = this.prevX;
					this.x = Math.round(this.rx);
				}
				this.prevY = this.ry;
				this.ry += this.vy * dt;
				this.y = Math.round(this.ry);
				if (this.moveCollisionTest()) {
					this.vy *= this.bounce;
					this.ry = this.prevY;
					this.y = Math.round(this.ry);
				}
				if (this.isGrabbed) {
					this.z = zLevels['player'] + this._y + 20;
				} else {
					this.z = this.baseZ + this._y;
				}
			}

		});
		return this;
	},

	moveCollisionTest: function() {
		var collisions = null;
		if (collisions = this.hit("Impassable")) {
			return collisions;
		}
		return false;
	}
});