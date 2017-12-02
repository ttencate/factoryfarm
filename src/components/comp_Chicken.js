"use strict";

Crafty.c('Chicken', {

	init: function() {
		this.happy = 50;
		this.fed = 50;
		this.age = 0;
		this.sick = 0;
		this.dest = {x: 500, y: 400};
		this.acc = 0.003;
		this.needCounter = 0;
	},
	_Chicken: function() {
		if (this.updateVelocity) {
			console.log("Warning: _Chicken should be called after the Moving component has been added!");
		}

		this.updateVelocity = function() {
			var dx = this.dest.x - this.x;
			var dy = this.dest.y - this.y;
			var polCoords = utility.car2pol(dx, dy);
			var angle = polCoords.phi;
			this.vx += Math.cos(angle) * this.acc;
			this.vy += Math.cos(angle) * this.acc;
		}

		this.bind("EnterFrame", function(){
			++this.needCounter;
			if (this.needCounter === 100) {
				this.needCounter = 0;
				// pick most urgent need
				var need = Math.min(Math.max(10, this.happy), this.fed);
				if (need < 80) {
					if (need === this.fed) { // go eat
						this.dest = {x: 800, y: 600};
					} else if (need === this.happy) { // have fun
						this.dest = {x: 200, y: 600};
					}
				}
				// move in the direction of your destination
			}
			this.updateVelocity();
		});
		return this;
	},

});