Crafty.c('KeyControls', {
	goingLeft: false,
	goingRight: false,
	goingUp: false,
	goingDown: false,

	init: function() {
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
		this.action = action
		return this;
	},

});