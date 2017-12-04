var utility = {
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
		};
	},

	car2pol: function(x, y) {
		return {
			r: Math.sqrt(x*x + y*y),
			phi: Math.atan2(y, x)
		};
	},

	normalizeAngle: function(phi) {
		while(phi < 0) {
			phi += 2 * Math.PI;
		}
		return phi % (2 * Math.PI);
	},

	formatMoney: function(money) {
		var prefix = (money < 0 ? '−' : '') + '$';
		var amount = '' + Math.abs(Math.round(money * 100) / 100);
		var dot = amount.indexOf('.');
		if (dot >= 0) {
			while (amount.length < dot + 3) {
				amount += '0';
			}
		}
		return prefix + amount;
	},

	clamp: function(min, max, value) {
		return Math.max(min, Math.min(max, value));
	},

	lerp: function(a, b, f) {
		return (1 - f) * a + f * b;
	},
};

Math.deg2rad = function(degrees) {
  return degrees * Math.PI / 180;
};

Math.rad2deg = function(radians) {
  return radians * 180 / Math.PI;
};
