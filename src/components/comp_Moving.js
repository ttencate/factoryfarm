Crafty.c("Moving", {
	init: function(){
		this.requires("2D");
		this.vx = 0.0;
		this.vy = 0.0;
		this.speed = 0.2;
	},

	_Moving: function() {
		this.bind("EnterFrame", function() {
			this.prevX = this.x;
			this.x += this.vx;
			if (this.moveCollisionTest()) {
				this.x = this.prevX;
			}
			this.prevY = this.y;
			this.y += this.vy;
			if (this.moveCollisionTest()) {
				this.y = this.prevY;
			}
			this.z = this.y + this.h;
		});
		return this;
	}
});