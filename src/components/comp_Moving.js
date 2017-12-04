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
		this.bind("EnterFrame", this.movingEnterFrame);
		return this;
	},

	remove: function() {
		this.unbind("EnterFrame", this.movingEnterFrame);
	},

	movingEnterFrame: function(timestep) {
		var dt = timestep.dt;
		var collisions = this.moveCollisionTest();
		if (collisions) { // if we're stuck, first get free
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
	},

	moveCollisionTest: function() {
		var collisions = this.hit('Impassable');
		if (!collisions) {
			return false;
		}
		if (this.has('CanMoveThroughGates')) {
			for (var i = 0; i < collisions.length; i++) {
				var obj = collisions[i].obj;
				if (!obj.has('Gate')) {
					return collisions;
				}
				var gateObj = obj._parent;
				if (gateObj && gateObj.matchNeighbors && !gateObj.gateOpen) {
					gateObj.gateOpen = true;
					Crafty.audio.play('gate_open');
					gateObj.matchNeighbors();
					gateObj.delay(function() {
						// Crafty.audio.play('gate_close');
						this.gateOpen = false;
						this.matchNeighbors();
					}.bind(gateObj), 500);
				}
			}
			return false;
		}
		return collisions;
	}
});
