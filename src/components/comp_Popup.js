Crafty.c("Popup", {
	init: function() {
		this.requires("2D, DOM,Text, Mouse, Tween");
		this.attr({x:200,y:100,h:360,w:360,alpha:0.8,z:1000}) ;
		this.textFont({size: '20px',  family: fontFamily1});
		this.css({'border-radius':' 5px','cursor': 'default' ,'background-color':mycolors.textBlockBg,'color':mycolors.textBlockText,'border':'1px solid #000000' ,'padding':'20px'});
		this.button = Crafty.e('2D, DOM,  Text, Mouse').attr({x:300,y:430,h:40,w:200,z:1110})
		.css({'text-align':'center', 'color':mycolors.button1Text,'background-color':mycolors.button1,'cursor':'pointer','border-radius':'5px'})
		.textFont({size: '32px',  family: 'Impact'})
		.bind('MouseOver',function(){this.css({	'background-color':mycolors.button1Hover, })})
		.bind('MouseOut',function(){this.css({	  'background-color':mycolors.button1, })});
		this.button.nr = 0;
		this.attach(this.button);
		this.bind('killText',function(){ this.destroy()});
		this.bind('changeText',function(){ 
			this.text('Tutorial text');
			this.button.text('Let\'s start!');
			});
		// Crafty.pause(1);
	},
	
	_Popup : function(levelText,buttonText){
		this.text(levelText);
		this.button.text(buttonText);
		this.button.bind('Click',function(){
            Crafty.pause(0);
            Crafty.trigger('killText');			
		});
		return this;
	}
	
});
