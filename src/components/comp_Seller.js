Crafty.c('Seller',{
	init: function(){
		this.requires('2D, WebGL, OriginCoordinates, Impassable, Collision');
		//this.color("mycolors.platformcolor");
		this.h = this.h ? this.h : 128;
		this.w = this.w ? this.w : 128;
		this.origin('center');
		this.collision([40,70, 88,70, 88,90, 40,90]);
		var chopArea = Crafty.e("2D, ChopArea, OriginCoordinates, Collision")
				.attr({x: this._x + 35, y: this._y + 50, w: 58, h: 40});
		this.attach(chopArea);
	},
	
	_Seller: function(x, y){
		this.x = 64*x;
		this.y = 64*y;
		this.baseZ = zLevels['seller'];
		this.z = this.baseZ + this.y;
		this.requires('seller, SpriteAnimation')
			.reel('sell', 500, [[0,0],[0,1],[0,2],[0,3],[0,4]])
			.animate('sell', 0)
			.pauseAnimation();
		this.bind("AnimationEnd", function() {
			this.animate('sell', 0).pauseAnimation();
		});
		return this;
	},

}); 
