"use strict";

Crafty.c('KeyControls', {
	goingLeft: false,
	goingRight: false,
	goingUp: false,
	goingDown: false,
	money: 100,

	init: function() {

		this.moneyText = document.getElementById('moneyText');
		this.updateMoneyText();

		// acceleration
		this.acc = 0.005;
		this.drag = 0.02;
		this.numSelections = 3;
		this.select(1);

		this.bind('KeyDown', function(keyEvent) {
			var k = keyEvent.key;
			if (k === this.up ) {
				this.goingUp = true;
			} else if (k === this.down) {
				this.goingDown = true;
			} else if (k === this.left) {
				this.goingLeft = true;
			} else if (k === this.right) {
				this.goingRight = true;
			} else if (k === this.action) {
					console.log(this.selected + " is maybe " + Crafty.keys['1'])
				if (this.selected === 1 && this.money > 30) { // spawn
					this.money -= 30;
					this.updateMoneyText();
					Crafty.e('2D, WebGL, Sprite, chicken_down, Moving, Collision, Chicken, SpriteAnimation, ReelFromVelocity')
						.reel('walking_down', 500, [[0, 0], [1, 0], [2, 0], [3, 0]])
						.reel('walking_up', 500, [[0, 1], [1, 1], [2, 1], [3, 1]])
						.reel('walking_right', 500, [[0, 2], [1, 2], [2, 2], [3, 2]])
						.reel('walking_left', 500, [[0, 3], [1, 3], [2, 3], [3, 3]])
						.animate('walking_down', 0)
						.attr({x: this._x, y: this._y, w: 32, h: 32, z: zLevels['chicken']})
						._Chicken()
						._Moving();
				}
			} else if (k >= Crafty.keys['1'] && k < Crafty.keys['1'] + this.numSelections) {
				this.select(k - Crafty.keys['1'] + 1);
			}
		});
		this.bind('KeyUp', function(keyEvent) {
			var k = keyEvent.key;
			if (k === this.up ) {
				this.goingUp = false;
			} else if (k === this.down) {
				this.goingDown = false;
			} else if (k === this.left) {
				this.goingLeft = false;
			} else if (k === this.right) {
				this.goingRight = false;
			}
		});

		this.bind('EnterFrame', function(timestep){
			this.updateVelocity(timestep.dt);
		});
	},

	_KeyControls: function(left, right, up, down, action) {
		this.left = left;
		this.right = right;
		this.up = up;
		this.down = down;
		this.action = action;
		return this;
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
		this.vx -= this.drag * this.vx * dt;
		this.vy -= this.drag * this.vy * dt;
		if (utility.sign(this.vx) * this.vx < 0.1 && !this.goingLeft && !this.goingRight) {
			this.vx = 0;
		}
		if (utility.sign(this.vy) * this.vy < 0.1 && !this.goingUp && !this.goingDown) {
			this.vy = 0;
		}
	},

	updateMoneyText: function() {
		this.moneyText.innerText = '$' + this.money;
	},

	select: function(selected) {
		this.selected = selected;
		var items = document.getElementsByClassName('hotbar-item');
		var activeItemId = 'hotbar-item-' + selected;
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.id === activeItemId) {
				item.classList.add('active');
			} else {
				item.classList.remove('active');
			}
		}
	},
});
