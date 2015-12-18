'use strict';

/**
 * Demo.
 */
var demo = (function(window, undefined) {

  /**
   * Enum of CSS selectors.
   */
	var SELECTORS = {
		pattern: '.pattern',
		card: '.service',
		cardImage: '.service-image',
		cardClose: '.service-btn-close',
	};

	/**
	 * Enum of CSS classes.
	 */
	var CLASSES = {
		patternHidden: 'pattern--hidden',
		polygon: 'polygon',
		polygonHidden: 'polygon--hidden'
	};


  /**
   * Map of svg paths and points.
   */
  var polygonMap = {
    paths: null,
    points: null
  };

  /**
   * Container of Card instances.
   */
  var layout = {};

  /**
   * Initialise demo.
   */
  function init() {

    // For options see: https://github.com/qrohlf/Trianglify
    var pattern = Trianglify({
      width: window.innerWidth,
      height: window.innerHeight,
      cell_size: 90,
      variance: 1,
      stroke_width: 1,
      x_colors: 'Purples'
    }).svg(); // Render as SVG.

    _mapPolygons(pattern);

    _bindCards();
  };

  /**
   * Store path elements, map coordinates and sizes.
   * @param {Element} pattern The SVG Element generated with Trianglify.
   * @private
   */
  function _mapPolygons(pattern) {

    // Append SVG to pattern container.
    $(SELECTORS.pattern).append(pattern);

    // Convert nodelist to array,
    // Used `.childNodes` because IE doesn't support `.children` on SVG.
    polygonMap.paths = [].slice.call(pattern.childNodes);

    polygonMap.points = [];

    polygonMap.paths.forEach(function(polygon) {

      // Hide polygons by adding CSS classes to each svg path (used attrs because of IE).
      $(polygon).attr('class', CLASSES.polygon);

      var rect = polygon.getBoundingClientRect();

      var point = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };

      polygonMap.points.push(point);
    });

    // All polygons are hidden now, display the pattern container.
    $(SELECTORS.pattern).removeClass(CLASSES.patternHidden);
  };

  /**
   * Bind Card elements.
   * @private
   */
  function _bindCards() {

    var elements = $(SELECTORS.card);

    $.each(elements, function(card, i) {

      var instance = new Card(i, card);

      layout[i] = {
        card: instance
      };

      var cardImage = $(card).find(SELECTORS.cardImage);
      var cardClose = $(card).find(SELECTORS.cardClose);

      $(cardImage).on('click', _playSequence.bind(this, true, i));
      $(cardClose).on('click', _playSequence.bind(this, false, i));
    });
  };

  /**
   * Create a sequence for the open or close animation and play.
   * @param {boolean} isOpenClick Flag to detect when it's a click to open.
   * @param {number} id The id of the clicked card.
   * @param {Event} e The event object.
   * @private
   *
   */
  function _playSequence(isOpenClick, id, e) {

    var card = layout[id].card;

    // Prevent when card already open and user click on image.
    if (card.isOpen && isOpenClick) return;

    // Create timeline for the whole sequence.
    var sequence = new TimelineLite({paused: true});

    var tweenOtherCards = _showHideOtherCards(id);

    if (!card.isOpen) {
      // Open sequence.

      _setPatternBgImg(e.target);

      sequence.add(tweenOtherCards);
      sequence.add(card.openCard(_onCardMove), 0);

    } else {
      // Close sequence.

      var closeCard = card.closeCard();
      var position = closeCard.duration() * 0.8; // 80% of close card tween.

      sequence.add(closeCard);
      sequence.add(tweenOtherCards, position);
    }

    sequence.play();
  };

  /**
   * Show/Hide all other cards.
   * @param {number} id The id of the clcked card to be avoided.
   * @private
   */
  function _showHideOtherCards(id) {

    var TL = new TimelineLite;

    var selectedCard = layout[id].card;

    for (var i in layout) {

      var card = layout[i].card;

      // When called with `openCard`.
      if (card.id !== id && !selectedCard.isOpen) {
        TL.add(card.hideCard(), 0);
      }

      // When called with `closeCard`.
      if (card.id !== id && selectedCard.isOpen) {
        TL.add(card.showCard(), 0);
      }
    }

    return TL;
  };

  /**
   * Add card image to pattern background.
   * @param {Element} image The clicked SVG Image Element.
   * @private
   */
  function _setPatternBgImg(image) {

    var imagePath = $(image).attr('xlink:href');

    $(SELECTORS.pattern).css('background-image', 'url(' + imagePath + ')');
  };

  /**
   * Callback to be executed on Tween update, whatever a polygon
   * falls into a circular area defined by the card width the path's
   * CSS class will change accordingly.
   * @param {Object} track The card sizes and position during the floating.
   * @private
   */
  function _onCardMove(track) {

    var radius = track.width / 2;

    var center = {
      x: track.x,
      y: track.y
    };

    polygonMap.points.forEach(function(point, i) {

      if (_detectPointInCircle(point, radius, center)) {
        $(polygonMap.paths[i]).attr('class', CLASSES.polygon + ' ' + CLASSES.polygonHidden);
      } else {
        $(polygonMap.paths[i]).attr('class', CLASSES.polygon);
      }
    });
  }

  /**
   * Detect if a point is inside a circle area.
   * @private
   */
  function _detectPointInCircle(point, radius, center) {

    var xp = point.x;
    var yp = point.y;

    var xc = center.x;
    var yc = center.y;

    var d = radius * radius;

    var isInside = Math.pow(xp - xc, 2) + Math.pow(yp - yc, 2) <= d;

    return isInside;
  };

  // Expose methods.
  return {
    init: init
  };

})(window);

// Kickstart Demo.
window.onload = demo.init;

function getUserLocation() {
	var input = jQuery('input[name="saddr"]');

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(getPosition);
		} else {
			input.val('Gelocation is not supported by your browser, please input your Post Code manually..');
		}
	}

	function getPosition(position) {
		input.val(position.coords.latitude + ', ' + position.coords.longitude)
	}
}

$(document).ready(function() {

	var map = new GMaps({
		el: '#map',
		lat: 53.048532,
		lng: -2.272429
	});

	map.addMarker({
		lat: 53.048532,
		lng: -2.262429,
		title: 'Lima'
	});

	var open = false;

	jQuery(window).on('scroll touchmove', function() {
		jQuery('.navbar').toggleClass('navbar-small', jQuery(document).scrollTop() > 0);
	});

	jQuery('.navbar-trigger').on('click', function(event) {
		event.preventDefault();

		var target = jQuery(this).data('target');

		if (!open) {
			jQuery(this).addClass('opened');
			jQuery(target).addClass('opened');

			open = true;
		} else {
			jQuery(this).removeClass('opened');
			jQuery(target).removeClass('opened');

			open = false;
		}
	});

	jQuery('.tabs li').on('click', function(event) {
		event.preventDefault();

		if(!jQuery(this).hasClass('active')) {
			var tab = jQuery(this).index();
			var child = tab + 1;

			jQuery('.tabs li.active').removeClass('active');
			jQuery(this).addClass('active');
			jQuery('.tabs-container .tab-pane.active').removeClass('active');
			jQuery('.tabs-container .tab-pane:nth-child(' + child + ')').addClass('active');
		};
	});


	var random = Math.floor(Math.random() * jQuery('#testimonials li').length);
	jQuery('#testimonials li').hide().eq(random).show();

	// Function to cycle through the reviews by fading them in/out

	(function showNextTestimonial() {
		jQuery('#testimonials li:visible').delay(7500).fadeOut('slow', function() {
			jQuery(this).appendTo('#testimonials ul');

			jQuery('#testimonials li:first').fadeIn('slow', function() {
				showNextTestimonial();
			});
		});
	})();

	getUserLocation();
});
