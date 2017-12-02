utility = {
	sign: function(num) {
		if (num === 0) {
			return 0;
		}
		return num / Math.abs(num);
	}
};