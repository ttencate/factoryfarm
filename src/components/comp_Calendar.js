Crafty.c('Calendar', {

	year: 0,
	month: 0,

	init: function() {
		this.requires('Delay');
		this.delay(this.nextMonth.bind(this), params.monthDurationMilliseconds, -1);
		this.updateTexts();
	},

	nextMonth: function() {
		this.month++;
		if (this.month >= 12) {
			this.month = 0;
			this.year++;
		}
		this.updateTexts();
	},

	updateTexts: function() {
		document.getElementById('monthText').innerText = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')[this.month];
		document.getElementById('yearText').innerText = this.year + 1;
	},
});
