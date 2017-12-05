"use strict";

Crafty.c('KeyControls', {
	goingLeft: false,
	goingRight: false,
	goingUp: false,
	goingDown: false,

	init: function() {
		this.requires('Wallet');
		this.baseZ = zLevels['player'];

		this.chickensText = document.getElementById('chickensText');
		this.chickenPopup = document.getElementById('chickenPopup');
		this.setMoney(50);

		showTip('welcome');

		// acceleration
		this.acc = 0.005;
		this.drag = 0.01;
		this.minSpeed = 8 / 1000; // px per ms
		this.maxSpeed = 256 / 1000; // px per ms
 
		this.grabArea = Crafty.e("2D, WebGL, Collision")
				.attr({x: 0, y: 0, w: params.grabAreaSize, h: params.grabAreaSize, z: zLevels["player"]});
		this.attach(this.grabArea);

		this.bind('KeyDown', function(keyEvent) {
			var k = keyEvent.key;
			var numberKey = keyEvent.key - Crafty.keys['0'];
			if (this.isKey(k, this.up)) {
				hideTip('welcome');
				this.direction = 'up';
				this.goingUp = true;
			} else if (this.isKey(k, this.down)) {
				hideTip('welcome');
				this.direction = 'down';
				this.goingDown = true;
			} else if (this.isKey(k, this.left)) {
				hideTip('welcome');
				this.direction = 'left';
				this.goingLeft = true;
			} else if (this.isKey(k, this.right)) {
				hideTip('welcome');
				this.direction = 'right';
				this.goingRight = true;
			} else if (this.isKey(k, this.action)) {
				this.startAction();
			} else if (this.isKey(k, this.grab)) { // grab chicken/item
				// check if "grab" area hits chicken. OLD IDEA: First position it correctly
				// 1. if the farmer has non-zero speed, position it in the forward direction
				// 2. if zero speed, position it in front of the farmer, based on the sprite
				if (Math.abs(this.vx) > 0 || Math.abs(this.vy) > 0) {
					// var polar = utility.car2pol(this.vx, this.vy);
					// this.grabArea.x = Math.cos(polar.phi) * params.grabReach + this.originX() - 0.5 * params.grabAreaSize;
					// this.grabArea.y = Math.sin(polar.phi) * params.grabReach + this.originY() - 0.5 * params.grabAreaSize;
					// this.grabArea.rotation = Math.rad2deg(polar.phi);
					var grabbed = this.grabArea.hit("Chicken");
					if (grabbed) {
						Crafty.audio.play('pickup', 1, 0.6);
						grabbed[0].obj.isGrabbed = true;
						this.grabbed = grabbed[0].obj;
						this.updateChickenPopup(this.grabbed);
					}
				}
			} else if (actionsByKey[numberKey]) {
				this.selectAction(actionsByKey[numberKey].name);
			}

			// no need to check every frame, keypress is a nice occasion
			showTip('thatsAll');
		});
		this.bind('KeyUp', function(keyEvent) {
			var k = keyEvent.key;
			var updateDirection = false;
			if (this.isKey(k, this.up)) {
				this.goingUp = false;
				updateDirection = true;
			} else if (this.isKey(k, this.down)) {
				this.goingDown = false;
				updateDirection = true;
			} else if (this.isKey(k, this.left)) {
				this.goingLeft = false;
				updateDirection = true;
			} else if (this.isKey(k, this.right)) {
				this.goingRight = false;
				updateDirection = true;
			} else if (this.isKey(k, this.action)) {
				this.stopAction();
			} else if (this.isKey(k, this.grab)) {
				if (this.grabbed) {
					var chopCollisions = this.grabbed.hit("ChopArea");
					if (chopCollisions) {
						if (this.grabbed.has("Chicken")) {
							chopCollisions[0].obj._parent.animate();
							Crafty.audio.play("chop");
							this.earnMoney(this.grabbed.getPrice(), 'Butchered ' + this.grabbed.name);
							this.grabbed.destroy();
							hideTip('sellChicken');
							hideTip('overripeChicken');
						}
					} else {
						Crafty.audio.play("drop"+ (1+Math.round(Math.random())));
					}
					this.grabbed.isGrabbed = false;
					this.grabbed = null;
					this.updateChickenPopup(null);
				}
			}
			if (updateDirection) {
				if (this.goingUp) {
					this.direction = 'up';
				} else if (this.goingDown) {
					this.direction = 'down';
				} else if (this.goingLeft) {
					this.direction = 'left';
				} else if (this.goingRight) {
					this.direction = 'right';
				}
			}
		});

		this.bind('EnterFrame', function(timestep) {
			this.updateVelocity(timestep.dt);

			if (this.money > ownedTiles * params.rentPerTile + actions.chicken.cost) {
				showTip('buyChicken');
			}
			if (this.money > ownedTiles * params.rentPerTile + actions.food.cost + 2 * actions.chicken.cost) {
				showTip('buyAnotherChicken');
			}

			if (this.grabbed) {
				// determine location of the grabbed item
				var grabX = null;
				var grabY = null;
				var dir = this.direction;
				// if (this.vx > 0 || this.vy > 0) {
				// 	var polar = utility.car2pol(this.vx, this.vy);
				// 	grabX = Math.cos(polar.phi) * params.grabReach + this.originX() - 0.5 * this.grabbed._w;
				// 	grabY = Math.sin(polar.phi) * params.grabReach + (this._y + 20) - 0.5 * this.grabbed._h;
				// } else {
					if (dir == "left") {
						grabX = -15 + this.originX() - 0.5 * this.grabbed._w;
						grabY = (this._y + 35) - 0.5 * this.grabbed._h;
					} else if (dir == "right") {
						grabX = 15 + this.originX() - 0.5 * this.grabbed._w;
						grabY = (this._y + 35) - 0.5 * this.grabbed._h;
					} else if (dir == "up") {
						grabX = this.originX() - 0.5 * this.grabbed._w;
						grabY = -10 + (this._y + 20) - 0.5 * this.grabbed._h;
					} else if (dir == "down") {
						grabX = this.originX() - 0.5 * this.grabbed._w;
						grabY = 20 + (this._y + 20) - 0.5 * this.grabbed._h;
					}
				// }
				if (!grabX || !grabY) {
					console.log("error: no grabs defined");
				}
				this.grabbed.rx = grabX;
				this.grabbed.ry = grabY;
			}

			this.updateChickensText();
			this.updateGrimness(timestep.dt);
		});
	},

	_KeyControls: function(left, right, up, down, action, grab) {
		this.left = left;
		this.right = right;
		this.up = up;
		this.down = down;
		this.action = action;
		this.grab = grab;
		return this;
	},

	isKey(k, keyList) {
		return keyList.indexOf(k) >= 0;
	},

	updateVelocity: function(dt) {
		if (this.goingUp)
			this.vy -= this.acc * dt;
		if (this.goingDown)
			this.vy += this.acc * dt;
		if (this.goingLeft)
			this.vx -= this.acc * dt;
		if (this.goingRight)
			this.vx += this.acc * dt;
		// console.log('vx: ' + this.vx)
		this.vx *= Math.pow(1 - this.drag, dt);
		this.vy *= Math.pow(1 - this.drag, dt);
		var speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
		if (speed > this.maxSpeed) {
			var speedFactor = this.maxSpeed / speed;
			this.vx *= speedFactor;
			this.vy *= speedFactor;
		}
		if (speed < this.minSpeed && !this.goingLeft && !this.goingRight && !this.goingUp && !this.goingDown) {
			this.vx = 0;
			this.vy = 0;
		}
	},

	updateChickensText: function() {
		var numChickens = Crafty('Chicken').length;
		this.chickensText.innerText = numChickens;
		var minGrimnessAt = 4;
		var maxGrimnessAt = 14;
	},

	updateGrimness: function(dt) {
		var averageHappiness = 0;
		var chickens = Crafty('Chicken');
		if (!chickens || !chickens.length) {
			return;
		}
		for (var i = 0; i < chickens.length; i++) {
			averageHappiness += Crafty(chickens[i]).happy;
		}
		averageHappiness /= chickens.length;

		var targetGrimness = utility.clamp(0, 1, 1 - averageHappiness / 100);
		// the more chickens, the smoother the average will vary, so the quicker we can update grimness
		var adjustSpeed = 0.0001 * chickens.length;
		globalGrimness += (targetGrimness - globalGrimness) * Math.min(1, dt * adjustSpeed);
	},

	updateChickenPopup: function(chicken) {
		if (!chicken) {
			this.chickenPopup.style.visibility = 'hidden';
			return;
		}
		this.chickenPopup.style.visibility = 'visible';
		var html = '';
		html += '<b>' + chicken.name + '</b>';
		html += '<dl>';
		html += '<dt>Happiness</dt><dd>' + heartString(chicken.happy) + '</dd>';
		html += '<dt>Fed</dt><dd>' + Math.round(chicken.fed) + '%</dd>';
		html += '<dt>Age</dt><dd>' + Math.floor(chicken.ageYears() * 10) / 10 + ' years</dd>';
		html += '<dt>Quality</dt><dd>' + Math.round(chicken.quality) + '%</dd>';
		html += '<dt>Value</dt><dd>' + utility.formatMoney(chicken.getPrice()) + '</dd>';
		html += '</dl>';
		this.chickenPopup.innerHTML = html;
	},
});

function heartString(percentage) {
	var html = '';
	for (var h = 20; h <= 100; h += 20) {
		if (percentage >= h) {
			html += '<i class="icon heart-full"></i>';
		} else {
			html += '<i class="icon heart-empty"></i>';
		}
	}
	return html;
}
