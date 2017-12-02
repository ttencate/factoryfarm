"use strict";

Crafty.c('Chicken', {

	init: function() {
		this.happy = 50;
		this.fed = 50;
		this.age = 0;
		this.sick = 0;
		this.dest = {x: 500, y: 400};
		this.acc = 0.003;
		this.drag = 0.007;

		this.needCounter = 0;
	},
	_Chicken: function() {
		if (this.updateVelocity) {
			console.log("Warning: _Chicken should be called after the Moving component has been added!");
		}

		this.updateVelocity = function(dt) {
			var dx = this.dest.x - this.x;
			var dy = this.dest.y - this.y;
			
			// use proximity to slow down in time
			var dSquared = dx * dx + dy * dy;
			var prox = Math.min(dSquared, params.proxLimit) / params.proxLimit;


			var polCoords = utility.car2pol(dx, dy);
			var angle = polCoords.phi;
			this.vx += Math.cos(angle) * this.acc * prox * dt;
			this.vy += Math.sin(angle) * this.acc * prox * dt;

			// apply drag force
			this.vx -= this.drag * this.vx * dt;
			this.vy -= this.drag * this.vy * dt;
			if (utility.sign(this.vx) * this.vx < 0.01) {
				this.vx = 0;
			}
			if (utility.sign(this.vy) * this.vy < 0.01) {
				this.vy = 0;
			}

		}

		this.bind("EnterFrame", function(timestep){
			var dt = timestep.dt;
			if (this.needCounter === 0) {
				this.needCounter = 100;
				// pick most urgent need
				var need = Math.min(Math.max(10, this.happy), this.fed);
				if (need < 80) {
					if (need === this.fed) { // go eat
						// console.log("need is feed");
						this.dest = {x: 400, y: 600};
					} else if (need === this.happy) { // have fun
						// console.log("fun4win");
						this.dest = {x: 200, y: 600};
					} else {
						// console.log("why did the chicken cross the street?");
					}
				}
				// move in the direction of your destination
			}
			--this.needCounter;
			this.updateVelocity(dt);
		});
		return this;
	},

});
