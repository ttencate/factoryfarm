Crafty.c('Seller',{
	init: function(){
		this.requires('2D, WebGL, OriginCoordinates, Impassable, Collision')
		//this.color("mycolors.platformcolor");
		this.h = this.h ? this.h : 128;
		this.w = this.w ? this.w : 128;
		this.origin('center');
		this.collision([30,60, 98,60, 98,90, 30,90]);
	},
	
	_Seller: function(x, y){
		this.x = 64*x;
		this.y = 64*y;
		this.baseZ = zLevels['walls'];
		this.z = this.baseZ + this.y;
		this.requires('seller, SpriteAnimation, WiredHitBox')
			.reel('sell', 500, [[3,0],[3,1],[3,2],[3,3]])
			.animate('sell', 2)
		console.log(this);
		return this;
	},

}); 