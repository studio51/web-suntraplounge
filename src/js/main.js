;(function(window) {
	'use strict';

	var isIOS = isIOSSafari(),
			clickHandler = isIOS || isTouch() ? 'touchstart' : 'click';

	function extend(a, b) {
		for(var key in b) {
			if(b.hasOwnProperty(key)) { a[key] = b[key]; }
		}
		return a;
	}

	function Animocon(el, options) {
		this.el = el;

		this.options  = extend( {}, this.options );
		this.checked 	= false;
		this.timeline = new mojs.Timeline();

		extend(this.options, options);

		for(var i = 0, len = this.options.tweens.length; i < len; ++i) {
			this.timeline.add(this.options.tweens[i]);
		}

		var self = this;

		this.el.addEventListener(clickHandler, function() {
			if(self.checked) {
				self.options.onUnCheck();
			} else {
				self.options.onCheck();
				self.timeline.replay();
			}

			self.checked = !self.checked;
		});
	}

	Animocon.prototype.options = {
		tweens: [
			new mojs.Burst({ })
		],

		onCheck		: function() { return false; },
		onUnCheck	: function() { return false; }
	};

	function init() {
		var container = $('.navbar-trigger'),
				containerSpan = $('.navbar-trigger-icon');

		var color = '#774D37';

		new Animocon(container[0], {
  		tweens: [

				new mojs.Burst({
					parent : container[0],
  				radius : { 90:150 },
  				count	 : 18,

  				children: {
						fill			: color,
						opacity		: 0.6,
						scale			:	1,
						radius		:	{ 'rand(5, 20)' : 0 },
						swirlSize : 15,
						direction : [ 1, 1, -1, -1, 1, 1, -1, -1, -1 ],
						duration	: 1200,
						delay			:	200,
						easing		:	mojs.easing.bezier(0.1, 1, 0.3, 1),
						isSwirl		: true
					}
				}),

				// Ring Animation
				//
				new mojs.Shape({
			  	parent			: container[0],
			  	radius			: { 30: 100 },
			  	fill				: 'transparent',
			  	stroke			: color,
			  	strokeWidth : { 30:0 },
			  	opacity			: 0.6,
			  	duration		: 1500,
			  	easing			: mojs.easing.bezier(0.1, 1, 0.3, 1)
				}),

				new mojs.Shape({
			  	parent			: container[0],
			  	radius			: { 30: 80 },
			  	fill				: 'transparent',
			  	stroke			: color,
			  	strokeWidth	: { 20:0 },
			  	opacity			: 0.3,
			  	duration		: 1600,
			  	delay				: 320,
			  	easing			: mojs.easing.bezier(0.1, 1, 0.3, 1)
				}),

				// Icon Scale Animation
				//
				new mojs.Tween({
  				duration : 1000,

					onUpdate: function(progress) {
						var elasticOutProgress = mojs.easing.elastic.out(1.43 * progress - 0.43);

						if(progress > 0.3) {
							containerSpan[0].style.WebkitTransform = containerSpan[0].style.transform = 'scale3d(' + elasticOutProgress + ', ' + elasticOutProgress + ', 1)';
						} else {
					  	containerSpan[0].style.WebkitTransform = containerSpan[0].style.transform = 'scale3d(0, 0, 1)';
						}
			  	}
				})
  		],

  		onCheck: function() {
				container[0].style.color = '#AACFBE';

				container.addClass('opened');
				containerSpan.addClass('opened');

				$('#navbar-menu').addClass('opened');
	  	},

  		onUnCheck: function() {
				container[0].style.color = '#C0C1C3';

				container.removeClass('opened');
				containerSpan.removeClass('opened');

				$('#navbar-menu').removeClass('opened');
	  	}
		});
	}

	init();
})(window);

$(document).ready(function() {
	$('#testimonials li').hide().eq(randomize($('#testimonials li'))).show();

	$('.tabs li:not(:last-child)').on('click', function(event) {
		event.preventDefault();

		if(!$(this).hasClass('active')) {
			var tab = $(this).index();
			var child = tab + 1;

			$('.tabs li.active').removeClass('active');
			$(this).addClass('active');
			$('.tabs-container .tab-pane.active').removeClass('active');
			$('.tabs-container .tab-pane:nth-child(' + child + ')').addClass('active');
		};
	});

	function showNextTestimonial() {
		$('#testimonials li:visible').delay(7500).fadeOut('slow', function() {
			$(this).appendTo('#testimonials ul');

			$('#testimonials li:first').fadeIn('slow', function() {
				showNextTestimonial()
			});
		});
	}
});
