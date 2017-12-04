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
		if (this.month == 6) {
			var money = Crafty('Wallet').money;
			if (money < 0) {
				showTip('rentCritical');
			} else if (money < ownedTiles * params.rentPerTile) {
				showTip('rentWarning');
			}
		}
		if (this.month >= 12) {
			this.month = 0;
			this.year++;
			Crafty('Wallet').payMoney(ownedTiles * params.rentPerTile, 'Yearly rent');
			hideTip('rentWarning');
			hideTip('rentCritical');
		}
		this.updateTexts();
	},

	updateTexts: function() {
		document.getElementById('monthText').innerText = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')[this.month];
		document.getElementById('yearText').innerText = this.year + 1;
	},
});
