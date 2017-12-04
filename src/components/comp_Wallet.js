Crafty.c('Wallet', {
	money: 0,

	init: function() {
		this.moneyText = document.getElementById('moneyText');

		this.bind('KeyDown', function(keyEvent) {
			if (keyEvent.key === Crafty.keys.NUMPAD_0) { // cheat for debugging
				this.earnMoney(1000, 'Cheater!');
			}
		});
	},

	canAfford: function(money) {
		return this.money >= money;
	},

	earnMoney: function(money, reason, entity) {
		this.setMoney(this.money + money);
		reason = reason ? reason + '<br>' : '';
		entity = entity || this;
		var text = reason + '<b>' + utility.formatMoney(money) + '</b>';
		var popup = Crafty.e('2D, DOM, Text, Tween, Delay')
			.attr({x: entity.x + entity.w / 2 - 128, y: entity.y - 32, z: entity.z + zLevels.popup, w: 256})
			.text(text)
			.textAlign('center')
			.textFont({ family: fontFamily1, size: '16px' })
			.textColor(money >= 0 ? '#d2ffb7' : '#FF4136')
			.css({ 'text-shadow': '1px 1px 2px #000000' })
			.unselectable();
		popup.tween({ y: popup.y - 60, alpha: 0 }, 3000);
		popup.delay(function() {
			popup.destroy();
		}, 3000);
	},

	payMoney: function(money, reason, entity) {
		this.earnMoney(-money, reason, entity);
	},

	setMoney: function(money) {
		this.money = money;
		this.moneyText.innerText = utility.formatMoney(this.money);
	},
});
