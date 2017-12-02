Crafty.c("Moving", {
	init: function(){
		this.requires("2D");
		this.vx = 0.0;
		this.vy = 0.0;
		this.acc = 0.005;
		this.drag = 0.01;
	},

	_Moving: function() {
		this.bind("EnterFrame", function(timestep) {
			// console.log(timestep);
			dt = timestep.dt;
			this.prevX = this.x;
			this.x += this.vx * dt;
			if (this.moveCollisionTest()) {
				this.x = this.prevX;
			}
			this.prevY = this.y;
			this.y += this.vy * dt;
			if (this.moveCollisionTest()) {
				this.y = this.prevY;
			}
			this.z = this.y + this.h;
		});
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

	moveCollisionTest: function() {
		if (this.hit("Wall")) {
			return true;
		}
		return false;
	}
});