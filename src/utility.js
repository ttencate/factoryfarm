utility = {
	sign: function(num) {
		if (num === 0) {
			return 0;
		}
		return num / Math.abs(num);
	},

	pol2car: function(r, phi) {
		return {
			x: Math.cos(phi) * r,
			y: Math.sin(phi) * r
		}
	},

	car2pol: function(x, y) {
		return {
			r: Math.sqrt(x*x + y*y),
			phi: Math.atan2(y, x)
		}
	},

	normalizeAngle: function(phi) {
		while(phi < 0) {
			phi += 2 * Math.PI;
		}
		return phi % (2 * Math.PI);
	},
	
};