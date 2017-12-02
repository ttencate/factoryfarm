Crafty.c('Wall',{
	init: function(){
		this.requires('2D, WebGL, OriginCoordinates, Collision');
		//this.color("mycolors.platformcolor");
		this.h = this.h ? this.h : 64;
		this.w = this.w ? this.w : 64;
		// this.z = params.zLevels['walls'];
		this.origin('center');
    //this.requires("WiredHitBox");
	},
	
	_Wall: function(x,y){
		this.requires('tileset').sprite(0,0);
		this.x = 64*x;
		this.y = 64*y;
		return this;
	},
	
}); 