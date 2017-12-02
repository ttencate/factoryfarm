// LOADING SCENE
Crafty.scene('HowToPlay', function() {
	Crafty.e('2D, DOM, Text')
		.attr({
			x: 106,
			y: 200,
			w: 300,
			h: 112,
			z: 8
		})
		.textFont({
			size: '45px',
			family: "Lovers Quarrel"
		})
		.css({
			'padding-top': '45px',
			'background-color': '#F5F4DA',
			'border': ('2px solid ' + mycolors.border),
			'border-radius': '15px',
			'cursor': 'pointer',
			'padding-top': '3px',
			'color': mycolors.infotext
		})
		.text('How To Actually Play?');
});