"use strict";

Crafty.c('Chicken', {

	init: function() {
		this.baseZ = zLevels['chicken'];
		this.name = femaleNames[Math.floor(Math.random() * femaleNames.length)];
		this.happy = 100;
		this.fed = 50;
		this.ageMs = 0;
		this.sick = 0;
		this.quality = 100;
		this.acc = 0.001;
		this.drag = 0.015;
		this.isGrabbed = false;
		this.currentNeed = "none";
		this.needWatch = Math.random() * params.needCheckTime;
		this.requires('OriginCoordinates');
		this.origin("center");
	},

	_Chicken: function() {
		if (this.updateVelocity) {
			console.log("Warning: _Chicken should be called after the Moving component has been added!");
		}
		this.dest = {x: this.originX(), y: this.originY()}; // must be an object with originX/originY functions OR x and y properties.

		this.updateVelocity = function(dt) {
			var dx = (this.dest.originX ? this.dest.originX() : this.dest.x) - this.originX();
			var dy = (this.dest.originY ? this.dest.originY() : this.dest.y) - this.originY();

			// use proximity to slow down in time and determine if the chicken is close enough to satisfy needs
			var dSquared = dx * dx + dy * dy;
			var prox;
			if (dSquared < params.needD2) {
				// chicken is close to destination that was chosen
				if (this.currentNeed === "fed") {
					var fraction = dt / params.feedTime;
					if (this.dest.has && this.dest.has('Feeder')) {
						var consumed = this.dest.consume(fraction);
						if (consumed > 0) {
							hideTip('hungryChicken');
						}
						this.fed = Math.min(100, this.fed + 100 * consumed);
					}
					prox = Math.min(dSquared, params.proxLimit) / params.proxLimit;
				} else {
					// for example near a happy tile
					prox = Math.min(dSquared, params.proxLimitLow) / params.proxLimitLow;
				}
			} else {
				prox = 1;
			}
			if (!this.isGrabbed) { // do not actively move if grabbed
				var polCoords = utility.car2pol(dx, dy);
				var angle = polCoords.phi;
				this.vx += Math.cos(angle) * this.acc * prox * dt;
				this.vy += Math.sin(angle) * this.acc * prox * dt;
			}

			// apply force away from other chickens
			var col = Math.floor(this.originX() / tileSize);
			var row = Math.floor(this.originY() / tileSize);
			var fx = 0;
			var fy = 0;
			var unitCount = 0; // never consider more than 10 just to be safe performance-wise
			for (var dr = -1; dr <= 1; dr++) {
				for (var dc = -1; dc <= 1; dc++) {
					var tile = getTile(col + dc, row + dr);
					if (!tile.units) continue;
					for (var i = 0; i < tile.units.length; i++) {
						unitCount++;
						if (unitCount > 10) break;
						var unit = tile.units[i];
						if (unit === this) continue;
						if (!unit.has || !unit.has('Chicken')) continue;
						var dx = this.originX() - unit.originX();
						var dy = this.originY() - unit.originY();
						var r = Math.sqrt(dx*dx + dy*dy);
						if (r < 0.01) {
							continue; // Avoid weirdness near/at zero.
						}
						var force = params.repelForce * Math.exp(-r*r / (params.repelForceDistance*params.repelForceDistance));
						fx += dx / r * force;
						fy += dy / r * force;
					}
					if (unitCount > 10) break;
				}
				if (unitCount > 10) break;
			}
			if (fx*fx + fy*fy >= params.repelForceThreshold*params.repelForceThreshold) { // prevents jittering back and forth
				this.vx += fx * dt;
				this.vy += fy * dt;
			}

			// apply drag force
			this.vx -= this.drag * this.vx * dt;
			this.vy -= this.drag * this.vy * dt;
			// if (utility.sign(this.vx) * this.vx < 0.01) {
			// 	this.vx = 0;
			// }
			// if (utility.sign(this.vy) * this.vy < 0.01) {
			// 	this.vy = 0;
			// }

		};

		this.bind("EnterFrame", this.chickenEnterFrame);
		return this;
	},

	remove: function() {
		this.unbind('EnterFrame', this.chickenEnterFrame);
	},

	chickenEnterFrame: function(timestep){
		var dt = timestep.dt;

		// update needs
		this.fed = Math.max(0, this.fed - params.hunger * dt);
		if (this.fed <= 0) {
			showTip('hungryChicken');
		}

		this.needWatch -= dt;
		if (this.needWatch < 0) {
			if (this.fed < params.criticalNeed) {
				Crafty.audio.play('hungry');
			} else if (this.happy < params.criticalNeed) {
				Crafty.audio.play('unhappy');
			} else {
				var clucking = Math.random();
				if (clucking < params.pCluck) {
					Crafty.audio.play('pok'+Math.round(1+Math.random()*2), 1, 0.5);
				}
			}

			// console.log('fed: ' + this.fed + ', happy: ' + this.happy);

			this.needWatch += params.needCheckTime;
			// make sure chicken stays assigned to the right tile
			var col = Math.floor(this.originX() / tileSize);
			var row = Math.floor(this.originY() / tileSize);
			var tile = getTile(col, row);
			if (tile && this.currentTile !== tile) {
				if (this.currentTile) {
					var myIdx = this.currentTile.units.indexOf(this);
					if (myIdx !== -1) {
						this.currentTile.units.splice(myIdx, 1);
					} else {
						console.log("DEBUG: unit was not in expected units list!");
					}
				}
				this.currentTile = tile;
				this.currentTile.units.push(this);
				// show tip if happiness impact from crowding is more than 30
				if (this.currentTile.units.length > 30 / params.crowdImpact) {
					showTip('buyFence');
				}
			}

			// calculate steady-state happiness in this location
			var ssHappy = this.currentTile.ssHappiness();
			var dHappy = ssHappy - this.happy;
			this.happy = utility.clamp(0, 100, this.happy + 0.005 * dHappy * dt);
			if (this.happy < 20) {
				showTip('unhappyChicken');
			}
			this.grimness = 1 - this.happy / 100;

			// maybe make a doo-doo
			if (Math.random() < params.pShit) {
				var tile = getTile(col, row);
				if (tile) tile.setFilth(tile.filth + 15);
			}

			// pick need, following rules in order:
			// 1. satisfy really urgent needs
			// 2. satisfy current need up to a threshold
			var minNeed = Math.min(this.fed, this.happy);
			if (minNeed < params.criticalNeed) {
				if (minNeed === this.fed) {
					this.currentNeed = "fed";
				} else if (minNeed === this.happy) {
					this.currentNeed = "happy";
				}
			} else if (this.currentNeed === "none" || this[this.currentNeed] > 80) { // reselect need if this one is satisfied
				// if all needs above 60, don't take action
				var need = Math.min(Math.min(60, this.happy), this.fed);
				if (need === this.fed) { // go eat
					this.currentNeed = "fed";
				} else if (need === this.happy) { // have fun
					this.currentNeed = "happy";
				} else {
					if (this.currentNeed === "none") { // chicken was already loitering
						if (Math.random() > 0.6) { // sometimes rest
							this.dest = {
								x: this.originX() + (0.5 - Math.random()) * params.chickWalkRange,
								y: this.originY() + (0.5 - Math.random()) * params.chickWalkRange
							};
						}
					} else { // just finished satisfying need, move away
						this.dest = {
							x: this.originX() + (0.5 - Math.random()) * params.chickWalkRange,
							y: this.originY() + (0.5 - Math.random()) * params.chickWalkRange
						};
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
						d2min = d2;
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
						var nextTile = getTile(newCol, newRow);
						if (nextTile) {
							if (nextTile.block) {
								break; // can't see through walls.
							} else if (!nextTile.paved && nextTile.ssHappiness() > this.happy + 20) {
								this.dest = {x: newCol * tileSize, y: newRow * tileSize};
								foundGrass = true;
								break;
							}
						} else { // out of bounds
							break;
						}
					}
					if (foundGrass) break;
				}
			}
		}

		// quality = average (happines+fed)/2 , clamped to 0-100, over lifetime
		this.quality = (this.quality * this.ageMs + utility.clamp(0, 100, (this.happy + this.fed) / 2) * dt) / (this.ageMs + dt);
		this.ageMs += dt;
		var ageYears = this.ageYears();
		if (ageYears >= params.ripeAgeYears && !this.ageIcon) {
			this.ageIcon = Crafty.e('2D, WebGL, Sprite, iconRipe')
					.attr({x: this.x, y: this.y - 16, w: 32, h: 32, z: this.z});
			this.attach(this.ageIcon);
			showTip('sellChicken');
		}
		if (this.ageIcon) {
			if (ageYears >= params.overripeAgeYears) {
				showTip('overripeChicken');
			}
			this.ageIcon.sprite(ageYears >= params.overripeAgeYears ? 'iconOverripe' : 'iconRipe');
			this.ageIcon.z = this.z;
		}
		if (ageYears >= params.deathAgeYears) {
			this.ageIcon.destroy();
			this.ageIcon = null;
			this.die();
		}

		this.updateVelocity(dt);
	},

	die: function() {
		this.removeComponent('Chicken');
		this.removeComponent('Moving');
		this.removeComponent('Collision');
		this.removeComponent('ReelFromVelocity');
		this.animate('dead', -1);
		this.dead = true;
	},

	ageYears: function() {
		return this.ageMs / params.yearDurationMilliseconds;
	},

	getPrice: function() {
		var ageYears = this.ageYears();
		var ripeness;
		if (ageYears < params.ripeAgeYears) {
			ripeness = ageYears / params.ripeAgeYears;
		} else if (ageYears < params.overripeAgeYears) {
			ripeness = 1;
		} else {
			ripeness = (params.deathAgeYears - ageYears) / (params.deathAgeYears - params.overripeAgeYears);
		}
		var quality = utility.clamp(0, 1, this.quality / 100);
		var priceRipe = utility.lerp(params.basePriceRipe, params.topQualityPriceRipe, quality);
		var price = utility.lerp(params.basePriceUnripe, priceRipe, ripeness);
		return price;
	},
});
