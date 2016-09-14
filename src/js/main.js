jQuery(document).ready(function() {

;(function(window) {

	'use strict';

	// taken from mo.js demos
	function isIOSSafari() {
		var userAgent;
		userAgent = window.navigator.userAgent;
		return userAgent.match(/iPad/i) || userAgent.match(/iPhone/i);
	};

	// taken from mo.js demos
	function isTouch() {
		var isIETouch;
		isIETouch = navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
		return [].indexOf.call(window, 'ontouchstart') >= 0 || isIETouch;
	};

	// taken from mo.js demos
	var isIOS = isIOSSafari(),
		clickHandler = isIOS || isTouch() ? 'touchstart' : 'click';

	function extend( a, b ) {
		for( var key in b ) {
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function Animocon(el, options) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );

		this.checked = false;

		this.timeline = new mojs.Timeline();

		for(var i = 0, len = this.options.tweens.length; i < len; ++i) {
			this.timeline.add(this.options.tweens[i]);
		}

		var self = this;
		this.el.addEventListener(clickHandler, function() {
			if( self.checked ) {
				self.options.onUnCheck();
			}
			else {
				self.options.onCheck();
				self.timeline.replay();
			}
			self.checked = !self.checked;
		});
	}

	Animocon.prototype.options = {
		tweens : [
			new mojs.Burst({})
		],
		onCheck : function() { return false; },
		onUnCheck : function() { return false; }
	};

	function init() {

    var el7 = $('.navbar-trigger'), el7span = $('.navbar-trigger-icon');
    new Animocon(el7[0], {
      tweens : [
        
        new mojs.Burst({
          parent: el7[0],
          radius: { 90:150 },
          count:  18,

          children: {
            fill:     '#774D37',
            opacity:   0.6,
            scale:     1,
            radius:    { 'rand(5,20)':0 },
            swirlSize: 15,
            direction: [ 1, 1, -1, -1, 1, 1, -1, -1, -1 ],
            duration:  1200,
            delay:     200,
            easing:    mojs.easing.bezier(0.1, 1, 0.3, 1),
            isSwirl:   true
          }
        }),

        // ring animation
        new mojs.Shape({
          parent:      el7[0],
          radius:      { 30: 100 },
          fill:        'transparent',
          stroke:      '#774D37',
          strokeWidth: { 30:0 },
          opacity:     0.6,
          duration:    1500,
          easing:      mojs.easing.bezier(0.1, 1, 0.3, 1)
        }),

        new mojs.Shape({
          parent:   el7[0],
          radius:   {30: 80},
          fill:   'transparent',
          stroke:   '#774D37',
          strokeWidth: { 20:0 },
          opacity:  0.3,
          duration:   1600,
          delay:  320,
          easing:   mojs.easing.bezier(0.1, 1, 0.3, 1)
        }),
        // icon scale animation
        new mojs.Tween({
          duration : 1000,
          onUpdate: function(progress) {
            if(progress > 0.3) {
              var elasticOutProgress = mojs.easing.elastic.out(1.43*progress-0.43);
              el7span[0].style.WebkitTransform = el7span[0].style.transform = 'scale3d(' + elasticOutProgress + ',' + elasticOutProgress + ',1)';
            }
            else {
              el7span[0].style.WebkitTransform = el7span[0].style.transform = 'scale3d(0,0,1)';
            }
          }
        })
      ],

      onCheck: function() {
        el7[0].style.color = '#AACFBE';

        el7.addClass('opened');
        el7span.addClass('opened');
        $('#navbar-menu').addClass('opened');
      },

      onUnCheck: function() {
        el7[0].style.color = '#C0C1C3';

        el7.removeClass('opened');
        el7span.removeClass('opened');
        $('#navbar-menu').removeClass('opened');
      }
    });
    /* Icon 7 */

    /* Icon 8 */
    // var el8 = items[7].querySelector('button.icobutton'), el8span = el8.querySelector('span');
    // var scaleCurve8 = mojs.easing.path('M0,100 L25,99.9999983 C26.2328835,75.0708847 19.7847843,0 100,0');
    // new Animocon(el8, {
    //  tweens : [
    //  // burst animation
    //  new mojs.Burst({
    //  parent:   el8,
		// 			count: 				28,
		// 			radius: 			{50:110},
		// 			children: {
		// 				fill: 			'#988ADE',
		// 				opacity: 		0.6,
		// 				radius: 		{'rand(5,20)':0},
		// 				scale: 			1,
		// 				swirlSize: 	15,
		// 				duration: 	1600,
		// 				easing: 		mojs.easing.bezier(0.1, 1, 0.3, 1),
		// 				isSwirl: 		true
		// 			}
		// 		}),
		// 		// burst animation
		// 		new mojs.Burst({
		// 			parent: 	el8,
		// 			count: 		18,
		// 			angle: 		{0:10},
		// 			radius: 	{140:200},
		// 			children: {
		// 				fill: 			'#988ADE',
		// 				shape: 			'line',
		// 				opacity: 		0.6,
		// 				radius: 		{'rand(5,20)':0},
		// 				scale: 			1,
		// 				stroke: 		'#988ADE',
		// 				strokeWidth: 2,
		// 				duration: 	1800,
		// 				delay: 			300,
		// 				easing: 		mojs.easing.bezier(0.1, 1, 0.3, 1)
		// 			}
		// 		}),
		// 		// burst animation
		// 		new mojs.Burst({
		// 			parent: 	el8,
		// 			radius: 	{40:80},
		// 			count: 		18,
		// 			children: {
		// 				fill: 			'#988ADE',
		// 				opacity: 		0.6,
		// 				radius: 		{'rand(5,20)':0},
		// 				scale: 			1,
		// 				swirlSize:  15,
		// 				duration: 	2000,
		// 				delay: 			500,
		// 				easing: 		mojs.easing.bezier(0.1, 1, 0.3, 1),
		// 				isSwirl: 		true
		// 			}
		// 		}),
		// 		// burst animation
		// 		new mojs.Burst({
		// 			parent: 	el8,
		// 			count: 		20,
		// 			angle: 		{0:-10},
		// 			radius: 	{90:130},
		// 			children: {
		// 				fill: 			'#988ADE',
		// 				opacity: 		0.6,
		// 				radius: 		{'rand(10,20)':0},
		// 				scale: 			1,
		// 				duration: 	3000,
		// 				delay: 			750,
		// 				easing: 		mojs.easing.bezier(0.1, 1, 0.3, 1)
		// 			}
		// 		}),
		// 		// icon scale animation
		// 		new mojs.Tween({
		// 			duration : 400,
		// 			easing: mojs.easing.back.out,
		// 			onUpdate: function(progress) {
		// 				var scaleProgress = scaleCurve8(progress);
		// 				el8span.style.WebkitTransform = el8span.style.transform = 'scale3d(' + progress + ',' + progress + ',1)';
		// 			}
		// 		})
		// 	],
		// 	onCheck : function() {
		// 		el8.style.color = '#988ADE';
		// 	},
		// 	onUnCheck : function() {
		// 		el8.style.color = '#C0C1C3';
		// 	}
		// });
		// /* Icon 8 */


	}

	init();

})(window);

// function getUserLocation() {
// 	var input = jQuery('input[name="saddr"]');
//
// 	function getLocation() {
// 		if (navigator.geolocation) {
// 			navigator.geolocation.getCurrentPosition(getPosition);
// 		} else {
// 			input.val('Gelocation is not supported by your browser, please input your Post Code manually..');
// 		}
// 	}
//
// 	function getPosition(position) {
// 		input.val(position.coords.latitude + ', ' + position.coords.longitude)
// 	}
// }

  // jQuery('.lazy').unveil();

  // $('.btn-action').on('click', function(event) {
	// 	event.preventDefault();
  //
  //   var $this  = $(this),
  //       target = $this.data('target'),
  //       klass  = 'opened';
  //
	// 	if (!open) {
	// 		$(this).addClass(klass);
	// 		$(target).addClass(klass);
  //
	// 		open = true;
	// 	} else {
	// 		$(this).removeClass(klass);
	// 		$(target).removeClass(klass);
  //
	// 		open = false;
	// 	}
	// });

	// var map = new GMaps({
	// 	el: '#map',
	// 	lat: 53.048532,
	// 	lng: -2.272429
	// });
	//
	// map.addMarker({
	// 	lat: 53.048532,
	// 	lng: -2.262429,
	// 	title: 'Lima'
	// });
	//
	// var open = false;



	// jQuery('.tabs li').on('click', function(event) {
	// 	event.preventDefault();
	//
	// 	if(!jQuery(this).hasClass('active')) {
	// 		var tab = jQuery(this).index();
	// 		var child = tab + 1;
	//
	// 		jQuery('.tabs li.active').removeClass('active');
	// 		jQuery(this).addClass('active');
	// 		jQuery('.tabs-container .tab-pane.active').removeClass('active');
	// 		jQuery('.tabs-container .tab-pane:nth-child(' + child + ')').addClass('active');
	// 	};
	// });


	// var random = Math.floor(Math.random() * jQuery('#testimonials li').length);
	// jQuery('#testimonials li').hide().eq(random).show();
	//
	// // Function to cycle through the reviews by fading them in/out
	//
	// (function showNextTestimonial() {
	// 	jQuery('#testimonials li:visible').delay(7500).fadeOut('slow', function() {
	// 		jQuery(this).appendTo('#testimonials ul');
	//
	// 		jQuery('#testimonials li:first').fadeIn('slow', function() {
	// 			showNextTestimonial();
	// 		});
	// 	});
	// })();
	//
	// getUserLocation();
});
