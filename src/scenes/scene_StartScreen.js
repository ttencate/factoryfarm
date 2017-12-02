Crafty.scene('StartScreen', function() {
   	// Crafty.background('url(assets/images/background.png)');
    
    // Title
	Crafty.e('2D, DOM, Text, Mouse')
		.text('Title')
		.textFont({ size: '37px',type: 'italic', family: fontFamily1})
		.attr({     x: 60,  y:85 ,   w:300, h:100 ,z:108  })
		.css({'padding-top': '5px','text-align':'center', 'text-shadow':'2px 2px '+ mycolors.titleshadow, 'color':mycolors.title});

	
	
	// start button
	Crafty.e('2D,DOM,Text, Mouse')
	.text('Start')
	.textFont({ size: '25px', family: fontFamily2})
	.attr({     x: 160,  y:163   ,z:1008, w:75, h:40})
	.css({'background-color':mycolors.button1,'color':mycolors.buttontext, 'border-radius':'25px', 'text-shadow':'1px 1px '+ mycolors.buttontextshadow,'cursor': 'pointer'})
	.bind('Click', function() {
		levelIdx=0;
		Crafty.scene('Main');
	 })
	.bind('MouseOver',function(){this.css({	'color':mycolors.buttontexthover, 'text-shadow':'1px 1px '+ mycolors.buttontexthovershadow,})})
	.bind('MouseOut',function(){this.css({	  'color':mycolors.buttontext, 'text-shadow':'1px 1px '+ mycolors.buttontextshadow,})});

	// Crafty.scene('Main');
});
