'use strict';

Crafty.c('Wall',{
	init: function(){
		this.requires('2D, WebGL, OriginCoordinates, Collision');
		//this.color("mycolors.platformcolor");
		this.h = this.h ? this.h : 64;
		this.w = this.w ? this.w : 64;
		this.origin('center');
		this.hitAreaV = Crafty.e("2D, WebGL, Collision, Impassable");
		this.hitAreaH = Crafty.e("2D, WebGL, Collision, Impassable");
		this.attach(this.hitAreaV);
		this.attach(this.hitAreaH);
		var lBound = this._x;
		var rBound = this._x + tileSize;
		var tBound = this._y + Math.floor(0.5 * tileSize) - 5;
		var bBound = this._y + Math.floor(0.5 * tileSize) + 5;
		this.hitAreaH.collision([lBound,tBound, rBound,tBound, rBound,bBound, lBound, bBound]);
		// this 2x2x2x2 matrix holds sprites such that spriteMatrix[L][T][R][B] has the correct sprite
		// if each letter is 0 for an empty neighbor, and 1 for a neighbor with a wall.
		this.spriteMatrix = [[[[{c:2,r:1},{c:2,r:2}],			// LTR(B?)
													 [{c:3,r:1},{c:3,r:2}]], 		// LT (B?)
													[[{c:2,r:0},{c:2,r:3}],			// L R(B?)
													 [{c:3,r:0},{c:3,r:3}]]],		// L  (B?)
												 [[[{c:1,r:1},{c:1,r:2}],			//  TR(B?)
													 [{c:4,r:1},{c:4,r:2}]], 		//  T (B?)
													[[{c:1,r:0},{c:1,r:3}],			//   R(B?)
													 [{c:4,r:0},{c:4,r:3}]]]];  //    (B?)
	},
	
	_Wall: function(x,y){
		this.requires('tileset').sprite(0,0);
		this.x = 64*x;
		this.y = 64*y;
		this.baseZ = zLevels['walls'];
		this.z = this.baseZ + this.y;
		return this;
	},

	// sprite and hitbox change depending on neighboring tiles
	matchNeighbors: function() {
		// first find neighbors
		var xIdx = this.x / 64;
		var yIdx = this.y / 64;
		var leftIdx = xIdx - 1;
		var rightIdx = xIdx + 1;
		var topIdx = yIdx - 1;
		var bottomIdx = yIdx + 1;
		var lCol = tileMatrix[leftIdx];
		var col = tileMatrix[xIdx];
		var rCol = tileMatrix[rightIdx];
		var leftNeighbor, topNeighbor, rightNeighbor, bottomNeighbor;
		leftNeighbor = topNeighbor = rightNeighbor = bottomNeighbor = 1; // 1 = second element, means absent

		leftNeighbor = lCol && lCol[yIdx] && lCol[yIdx].block && lCol[yIdx].block.has("Wall") ? 0 : 1;
		topNeighbor = col && col[topIdx] && col[topIdx].block && col[topIdx].block.has("Wall") ? 0 : 1;
		bottomNeighbor = col && col[bottomIdx] && col[bottomIdx].block && col[bottomIdx].block.has("Wall") ? 0 : 1;
		rightNeighbor = rCol && rCol[yIdx] && rCol[yIdx].block && rCol[yIdx].block.has("Wall") ? 0 : 1;

		var spriteCoords;
		if (this.has("Gate")) {
			if ((!topNeighbor || !bottomNeighbor) && leftNeighbor && rightNeighbor) {
				spriteCoords = {c: 4, r: 1};
				this.sprite(5, 4 + (this.gateCloseDelay ? 1 : 0));
			} else {
				spriteCoords = {c: 2, r: 3};
				this.sprite(4, 4 + (this.gateCloseDelay ? 1 : 0));
			}
		} else {
			spriteCoords = this.spriteMatrix[leftNeighbor][topNeighbor][rightNeighbor][bottomNeighbor];
			// set sprites to match neighbors
			this.sprite(spriteCoords.c, spriteCoords.r);
		}

		var hitAreaComponents = "2D, Collision, Impassable";
		if (this.has('Gate')) {
			hitAreaComponents += ', Gate';
		}

		// set hitboxes to match neighbors
		this.hitAreaH.destroy();
		this.hitAreaV.destroy();
		var lBound, rBound, tBound, bBound;
		var horz, vert; // flags to indicate if direction is needed
		horz = vert = true;
		// set horizontal collision area
		tBound = 0.5 * tileSize - 5;
		bBound = 0.5 * tileSize + 5;
		if (spriteCoords.c == 1) { // right half collides
			lBound = 0.5 * tileSize;
			rBound = tileSize;
		} else if (spriteCoords.c == 2) { // full width collides
			lBound = 0;
			rBound = tileSize;
		} else if (spriteCoords.c == 3) { // left half collides
			lBound = 0;
			rBound = 0.5 * tileSize;
		} else {
			horz = false;
		}
		if (horz) {
			this.hitAreaH = Crafty.e(hitAreaComponents).attr({x: this._x, y: this._y, w: this._w, h: this._h});
			this.hitAreaH.collision([lBound,tBound, rBound,tBound, rBound,bBound, lBound, bBound]);
			this.attach(this.hitAreaH);
		}

		// set vertical collision area
		lBound = 0.5 * tileSize - 5;
		rBound = 0.5 * tileSize + 5;
		if (spriteCoords.r == 0) { // bottom half collides
			tBound = 0 + 0.5 * tileSize;
			bBound = tileSize;
		} else if (spriteCoords.r == 1) { // full height collides
			tBound = 0;
			bBound = tileSize;
		} else if (spriteCoords.r == 2) { // top half collides
			tBound = 0;
			bBound = 0.5 * tileSize;
		} else if (!horz) {
			tBound = 0.5 * tileSize - 5;
			bBound = 0.5 * tileSize + 5;
		} else {
			vert = false;
		}
		if (vert) {
			this.hitAreaV = Crafty.e(hitAreaComponents).attr({x: this._x, y: this._y, w: this._w, h: this._h});
			this.hitAreaV.collision([lBound,tBound, rBound,tBound, rBound,bBound, lBound, bBound]);
			this.attach(this.hitAreaV);
		}
	},

	matchAndFixNeighbors: function(c, r){
		this.matchNeighbors();
		var left = tileMatrix[c-1] && tileMatrix[c-1][r] ? tileMatrix[c-1][r].block : null;
		if (left && left.matchNeighbors) left.matchNeighbors();
		var right = tileMatrix[c+1] && tileMatrix[c+1][r] ? tileMatrix[c+1][r].block : null;
		if (right && right.matchNeighbors) right.matchNeighbors();
		var top = tileMatrix[c] && tileMatrix[c][r-1] ? tileMatrix[c][r-1].block : null;
		if (top && top.matchNeighbors) top.matchNeighbors();
		var bottom = tileMatrix[c] && tileMatrix[c][r+1] ? tileMatrix[c][r+1].block : null;
		if (bottom && bottom.matchNeighbors) bottom.matchNeighbors();
	}
}); 
