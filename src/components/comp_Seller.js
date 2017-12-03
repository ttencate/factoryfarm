Crafty.c('Seller',{
	init: function(){
		this.requires('2D, WebGL, Sprite, OriginCoordinates, Impassable, Collision');
		//this.color("mycolors.platformcolor");
		this.h = this.h ? this.h : 128;
		this.w = this.w ? this.w : 128;
		this.origin('center');
		this.collision([10,30, 54,30, 54,60, 10,60]);
	},
	
	_Feeder: function(x,y){
		this.requires('tileset').sprite(5,0);
		this.x = 64*x;
		this.y = 64*y;
		this.baseZ = zLevels['walls'];
		this.z = this.baseZ + this.y;
		return this;
	},

}); 