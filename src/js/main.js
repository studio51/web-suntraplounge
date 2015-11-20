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
      stroke_width: 0.6,
      color_function : function(x, y) {
        return '#de6551';
      }
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
      $(polygon).attr('class', CLASSES.polygon + ' ' + CLASSES.polygonHidden);

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
        $(polygonMap.paths[i]).attr('class', CLASSES.polygon);
      } else {
        $(polygonMap.paths[i]).attr('class', CLASSES.polygon + ' ' + CLASSES.polygonHidden);
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

// jQuery(document).ready(function(event){
//   var projectsContainer = $('.cd-projects-container'),
//     navigation = $('.cd-primary-nav'),
//     triggerNav = $('.cd-nav-trigger'),
//     logo = $('.cd-logo');

//   triggerNav.on('click', function(){
//     if( triggerNav.hasClass('project-open') ) {
//       //close project
//       projectsContainer.removeClass('project-open').find('.selected').removeClass('selected').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
//         $(this).children('.cd-project-info').scrollTop(0).removeClass('has-boxshadow');

//       });
//       triggerNav.add(logo).removeClass('project-open');
//     } else {
//       //trigger navigation visibility
//       triggerNav.add(projectsContainer).add(navigation).toggleClass('nav-open');
//     }
//   });

//   projectsContainer.on('click', '.single-project', function(){
//     var selectedProject = $(this);
//     if( projectsContainer.hasClass('nav-open') ) {
//       //close navigation
//       triggerNav.add(projectsContainer).add(navigation).removeClass('nav-open');
//     } else {
//       //open project
//       selectedProject.addClass('selected');
//       projectsContainer.add(triggerNav).add(logo).addClass('project-open');
//     }
//   });

//   projectsContainer.on('click', '.cd-scroll', function(){
//     //scroll down when clicking on the .cd-scroll arrow
//     var visibleProjectContent =  projectsContainer.find('.selected').children('.cd-project-info'),
//       windowHeight = $(window).height();

//     visibleProjectContent.animate({'scrollTop': windowHeight}, 300);
//   });

//   //add/remove the .has-boxshadow to the project content while scrolling
//   var scrolling = false;
//   projectsContainer.find('.cd-project-info').on('scroll', function(){
//     if( !scrolling ) {
//       (!window.requestAnimationFrame) ? setTimeout(updateProjectContent, 300) : window.requestAnimationFrame(updateProjectContent);
//       scrolling = true;
//     }
//   });

//   function updateProjectContent() {
//     var visibleProject = projectsContainer.find('.selected').children('.cd-project-info'),
//       scrollTop = visibleProject.scrollTop();
//     ( scrollTop > 0 ) ? visibleProject.addClass('has-boxshadow') : visibleProject.removeClass('has-boxshadow');
//     scrolling = false;
//   }
// });


// $(document).ready(function() {
//   var map = new GMaps({
//     el: '#map',
//     lat: 53.048532,
//     lng: -2.262429
//   });
// })

// jQuery(document).ready(function($){
//   //trigger the animation - open modal window
//   $('[data-type="modal-trigger"]').on('click', function(){
//     var actionBtn = $(this),
//       scaleValue = retrieveScale(actionBtn.next('.cd-modal-bg'));

//     actionBtn.addClass('to-circle');
//     actionBtn.next('.cd-modal-bg').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
//       animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
//     });

//     //if browser doesn't support transitions...
//     if(actionBtn.parents('.no-csstransitions').length > 0 ) animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
//   });

//   //trigger the animation - close modal window
//   $('.cd-section .cd-modal-close').on('click', function(){
//     closeModal();
//   });
//   $(document).keyup(function(event){
//     if(event.which=='27') closeModal();
//   });

//   $(window).on('resize', function(){
//     //on window resize - update cover layer dimention and position
//     if($('.cd-section.modal-is-visible').length > 0) window.requestAnimationFrame(updateLayer);
//   });

//   function retrieveScale(btn) {
//     var btnRadius = btn.width()/2,
//       left = btn.offset().left + btnRadius,
//       top = btn.offset().top + btnRadius - $(window).scrollTop(),
//       scale = scaleValue(top, left, btnRadius, $(window).height(), $(window).width());

//     btn.css('position', 'fixed').velocity({
//       top: top - btnRadius,
//       left: left - btnRadius,
//       translateX: 0,
//     }, 0);

//     return scale;
//   }

//   function scaleValue( topValue, leftValue, radiusValue, windowW, windowH) {
//     var maxDistHor = ( leftValue > windowW/2) ? leftValue : (windowW - leftValue),
//       maxDistVert = ( topValue > windowH/2) ? topValue : (windowH - topValue);
//     return Math.ceil(Math.sqrt( Math.pow(maxDistHor, 2) + Math.pow(maxDistVert, 2) )/radiusValue);
//   }

//   function animateLayer(layer, scaleVal, bool) {
//     layer.velocity({ scale: scaleVal }, 400, function(){
//       $('body').toggleClass('overflow-hidden', bool);
//       (bool)
//         ? layer.parents('.cd-section').addClass('modal-is-visible').end().off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend')
//         : layer.removeClass('is-visible').removeAttr( 'style' ).siblings('[data-type="modal-trigger"]').removeClass('to-circle');
//     });
//   }

//   function updateLayer() {
//     var layer = $('.cd-section.modal-is-visible').find('.cd-modal-bg'),
//       layerRadius = layer.width()/2,
//       layerTop = layer.siblings('.btn').offset().top + layerRadius - $(window).scrollTop(),
//       layerLeft = layer.siblings('.btn').offset().left + layerRadius,
//       scale = scaleValue(layerTop, layerLeft, layerRadius, $(window).height(), $(window).width());

//     layer.velocity({
//       top: layerTop - layerRadius,
//       left: layerLeft - layerRadius,
//       scale: scale,
//     }, 0);
//   }

//   function closeModal() {
//     var section = $('.cd-section.modal-is-visible');
//     section.removeClass('modal-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
//       animateLayer(section.find('.cd-modal-bg'), 1, false);
//     });
//     //if browser doesn't support transitions...
//     if(section.parents('.no-csstransitions').length > 0 ) animateLayer(section.find('.cd-modal-bg'), 1, false);
//   }
// });

