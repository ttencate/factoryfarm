"use strict";

Crafty.c("Moving", {
	init: function(){
		this.requires("2D");
		this.vx = 0.0;
		this.vy = 0.0;
		this.drag = 0.005;
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
		});
		return this;
	},

	moveCollisionTest: function() {
		if (this.hit("Wall")) {
			return true;
		}
		return false;
	}
});