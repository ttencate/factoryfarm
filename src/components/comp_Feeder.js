Crafty.c('Feeder',{
	// One filling unit fills one chicken
	filling: 0,
	maxFilling: 30,

	init: function(){
		this.requires('2D, WebGL, Sprite, tileset, OriginCoordinates, Impassable, Collision');
		//this.color("mycolors.platformcolor");
		this.h = this.h ? this.h : 64;
		this.w = this.w ? this.w : 64;
		this.origin('center');
		this.collision([10,30, 54,30, 54,60, 10,60]);
		this.refill();
	},
	
	_Feeder: function(x,y){
		this.x = 64*x;
		this.y = 64*y;
		this.baseZ = zLevels['walls'];
		this.z = this.baseZ + this.y;
		return this;
	},

	refill: function() {
		this.setFilling(this.maxFilling);
	},

	canConsume: function(amount) {
		return this.filling >= amount;
	},

	consume: function(amount) {
		if (amount > this.filling) {
			amount = this.filling;
			this.setFilling(0);
			return amount;
		} else {
			this.setFilling(this.filling - amount);
			return amount;
		}
	},

	setFilling: function(filling) {
		this.filling = utility.clamp(0, this.maxFilling, filling);
		var factor = filling / this.maxFilling;
		this.sprite(5,
			factor <= 0 ? 0 :
			factor <= 0.3 ? 1 :
			2);
	},
}); 
