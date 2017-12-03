"use strict";

Crafty.c('Chicken', {

	init: function() {
		this.baseZ = zLevels['chicken'];
		this.happy = 50;
		this.fed = 50;
		this.age = 0;
		this.sick = 0;
		this.dest = {x: 500, y: 400}; // must be an object with originX/originY functions OR x and y properties.
		this.acc = 0.001;
		this.drag = 0.007;
		this.isGrabbed = false;
		this.needWatch = Math.random() * params.needCheckTime;
		this.requires('OriginCoordinates');
		this.origin("center");
	},
	_Chicken: function() {
		if (this.updateVelocity) {
			console.log("Warning: _Chicken should be called after the Moving component has been added!");
		}

		this.updateVelocity = function(dt) {
			var dx = (this.dest.originX ? this.dest.originX() : this.dest.x) - this.originX();
			var dy = (this.dest.originY ? this.dest.originY() : this.dest.y) - this.originY();
			
			// use proximity to slow down in time and determine if the chicken is close enough to satisfy needs
			var dSquared = dx * dx + dy * dy;
			if (dSquared < params.needD2) {
				// chicken is really close to destination that was
				if (this.currentNeed === "fed") {
					this.fed += 0.5;
				} else if (this.currentNeed === "happy") {
					this.happy += 0.5;
				}
			}
			var prox = Math.min(dSquared, params.proxLimit) / params.proxLimit;
			if (!this.isGrabbed) { // do not actively move if grabbed
				var polCoords = utility.car2pol(dx, dy);
				var angle = polCoords.phi;
				this.vx += Math.cos(angle) * this.acc * prox * dt;
				this.vy += Math.sin(angle) * this.acc * prox * dt;
			}

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
			this.needWatch -= dt;
			if (this.needWatch < 0) {
				console.log(dt);
				this.needWatch += params.needCheckTime;
				console.log('fed: ' + this.fed + ', happy: ' + this.happy);
				var col = Math.floor(this.originX() / tileSize);
				var row = Math.floor(this.originY() / tileSize);
				// update needs and check most pressing one
				this.fed -= 3 + 2 * Math.random();
				this.happy -= 4 + 1 * Math.random();
				// pick need, following rules in order:
				// 1. satisfy really urgent needs
				// 2. satisfy current need up to a threshold
				if (this.fed < 10) {
					this.currentNeed = "fed";
				} else if (this.currentNeed === "none" || this[this.currentNeed] > 80) { // reselect need if this one is satisfied
					// if all needs above 60, don't take action
					var need = Math.min(Math.min(60, this.happy), this.fed);
					if (need === this.fed) { // go eat
						this.currentNeed = "fed";
					} else if (need === this.happy) { // have fun
						this.currentNeed = "happy";
						this.dest = {x: 200, y: 600};
					} else {
						if (this.currentNeed === "none") { // chicken was already loitering
							if (Math.random() > 0.6) { // sometimes rest
								this.dest = {x: this.originX() + (0.5 - Math.random()) * params.chickWalkRange,
														 y: this.originY() + (0.5 - Math.random()) * params.chickWalkRange}
							}
						} else { // just finished satisfying need, move away
							this.dest = {x: this.originX() + (0.5 - Math.random()) * params.chickWalkRange,
													 y: this.originY() + (0.5 - Math.random()) * params.chickWalkRange};
							this.currentNeed = "none";
						}
					}
				}
				if (this.currentNeed === "fed") {
					// find nearest feeder
					var feeders = Crafty("Feeder");
					var feeder = null;
					var dx, dy, d2;
					var d2min = Infinity;
					for (var i = 0; i < feeders.length; i++) {
						feeder = Crafty(feeders[i]);
						dx = feeder.originX() - this.originX();
						dy = feeder.originY() - this.originY();
						d2 = dx * dx + dy * dy;
						if (d2 < d2min) {
							this.dest = feeder;
						}
					}
				} else if (this.currentNeed === "happy") {
					// find patch of grass for happiness
					var newCol, newRow;
					var startPhi = Math.random() * 2 * Math.PI;
					var phiStep = 2 * Math.PI / 20;
					var foundGrass = false;
					// sample tiles along lines of sight until grass is found
					for (var phi = startPhi; phi < startPhi + 2 * Math.PI; phi += phiStep) {
						for (var r = 1; r < params.grassSearchRadius; r++) { // radius in tiles
							newCol = Math.round(col + r * Math.cos(phi));
							newRow = Math.round(row + r * Math.sin(phi));
							if (tileMatrix[newCol] && tileMatrix[newCol][newRow] && !tileMatrix[newCol][newRow].paved) {
								this.dest = {x: newCol * tileSize, y: newRow * tileSize};
								foundGrass = true;
								break;
							}
						}
						if (foundGrass) break;
					}
				}
			}
			this.updateVelocity(dt);
		});
		return this;
	},

});
