/**
 * grid3d.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */

;(function(window) {
	'use strict';

	function grid3D(el, options) {
		this.el = el;
		this.options = extend({ }, this.options);

		extend(this.options, options);
		this._init();
	}

	grid3D.prototype.options = { };

	grid3D.prototype._init = function() {
		this.gridWrap			= $('.services--categories-wrapper');   			// Wrapper
		this.grid					= $('.services--categories-inner');						// Element
		this.gridItems		= [].slice.call($('.service-category')); 			// Main Grid Items
		this.itemSize			= {
			width  : this.gridItems[0].offsetWidth,
			height : this.gridItems[0].offsetHeight
		};																															// Default size for Grid Items

		this.contentEl 		= $('.services--content'); 										// Content
		this.contentItems = [].slice.call($('.service-content--page')); // Content Items
		this.close 				= $('.close-page'); 													// Close Content
		this.loader 			= $('.loading'); 															// Loading Indicator

		this.support = support.pointerevents && support.csstransitions && support.csstransforms3d;
		this._initEvents();
	};

	grid3D.prototype._initEvents = function() {
		var self = this;

		// Open the Content Element when clicking on the main Grid Items
		//
		this.gridItems.forEach(function(item, idx) {
			item.addEventListener('click', function() {
				self._showContent(item, $(item).data('target'));
			});
		});

		// Close the content elements
		//
		$(this.close).on('click', function() { self._hideContent(); });

		if(this.support) {
			window.addEventListener('resize', function() { self._resizeHandler(); });

			// Trick to prevent scrolling when animation is running on opening only.
			// This prevents that the back of the placeholder does not stay positioned in a wrong way.
			//
			window.addEventListener('scroll', function() {
				if (self.isAnimating) {
					window.scrollTo(self.scrollPosition ? self.scrollPosition.x : 0, self.scrollPosition ? self.scrollPosition.y : 0 );
				} else {

					self.scrollPosition = {
						x : window.pageXOffset || docElem.scrollLeft,
						y : window.pageYOffset || docElem.scrollTop
					};

					// Change th Grid perspective origin as we scroll the page
					//
					self._scrollHandler();
				}
			});
		}
	};

	// Creates the placeholder and animates it to fullscren
	// In the end of the animation the content is shown
	// A loading indicator will appear for 1 second to simulate a loading period
	//
	grid3D.prototype._showContent = function(service, target) {
		if(this.isAnimating) { return false }

		this.isAnimating = true;

		var self = this,
				loadContent = function() {

					// Simulating Loading
					//
					setTimeout(function() {
						$(self.loader[0]).removeClass('show');

						// After the end of the transition, set the Content Item class to "show"
						//
						$('#' + target).addClass('show');
					}, 1000);

					$(self.contentEl[0]).addClass('show'); // Show the content area
					$(self.loader[0]).addClass('show');    // Show the Loader
					$(document.body).addClass('no-scroll');

					self.isAnimating = false;
				};

		// FALLBACK: Load the content if no support
		//
		if(!this.support) { loadContent(); return false; }

		var currentItem = $(service),
				itemContent = currentItem.find('img');

		// Create the Placeholder
		//
		this.placeholder = this._createPlaceholder(itemContent[0]);

		// Set the top and left of the Placeholder to the top and left ot the clicked Grid Item
		//
		this.placeholder.style.left = currentItem.offsetLeft + 'px';
		this.placeholder.style.top 	= currentItem.offsetTop + 'px';

		// Append the Placeholder to the Grid
		//
		$(this.grid).append(this.placeholder);

		var animateGridItem = function() {
			$(currentItem).addClass('active');			// Add "active" class to the current Grid Item
			$(self.gridWrap).addClass('view-full'); // Add "view-full" class to the Grid Wrap
			self._resizePlaceholder();							// Set size and position(left/top) of Placeholder

			var onEndTransitionFn = function(ev) {
				if(ev.propertyName.indexOf('transform') === -1) return false;

				this.removeEventListener(transEndEventName, onEndTransitionFn);
				loadContent();
			};

			self.placeholder.addEventListener(transEndEventName, onEndTransitionFn);
		};

		setTimeout(animateGridItem, 25);
	};

	grid3D.prototype._hideContent = function() {
		var self = this,
				contentItem = $('.services--content > .show'),
			 	currentItem = $('.services--categories-inner').find('.service-category.active');

		$(contentItem).removeClass('show');
		$(this.contentEl).removeClass('show');

		setTimeout(function() { $(document.body).removeClass('no-scroll'); }, 25);

		if(!this.support) return false;

		$(this.gridWrap).removeClass('view-full');

		this.placeholder.style.left 	= currentItem[0].offsetLeft + 'px';
		this.placeholder.style.top 		= currentItem[0].offsetTop + 'px';
		this.placeholder.style.width 	= this.itemSize.width + 'px';
		this.placeholder.style.height = this.itemSize.height + 'px';

		var onEndPlaceholderTransFn = function(ev) {
			this.removeEventListener(transEndEventName, onEndPlaceholderTransFn);
			self.placeholder.parentNode.removeChild(self.placeholder);
			$(currentItem).removeClass('active');
		};

		this.placeholder.addEventListener(transEndEventName, onEndPlaceholderTransFn);
	}

	// Create the Placeholder function
	//
	// <div class="placeholder">
	//		<div class="front">[content]</div>
	// 		<div class="back"></div>
	// </div>
	//
	grid3D.prototype._createPlaceholder = function(content) {

		// Create the front of the Placeholder
		//
		var front = document.createElement('div');
				front.className = 'front';

		$(front).html(content);

		// Create the back of the Placeholder
		//
		var back = document.createElement('div');
				back.className = 'back';

		back.innerHTML = '&nbsp;';

		// Create the Placeholder and add the Front and Back elements
		//
		var placeholder = document.createElement('div');
				placeholder.className = 'placeholder';

		$(placeholder).append(front);
		$(placeholder).append(back);

		return placeholder;
	};

	grid3D.prototype._scrollHandler = function() {
		var self = this;

		if(!this.didScroll) {
			this.didScroll = true;

			setTimeout(function() { self._scrollPage(); }, 60 );
		}
	};

	grid3D.prototype._scrollPage = function() {
		var perspY = scrollY() + getViewportH() / 2;

		this.gridWrap[0].style.WebkitPerspectiveOrigin = '50% ' + perspY + 'px';
		this.gridWrap[0].style.MozPerspectiveOrigin 	 = '50% ' + perspY + 'px';
		this.gridWrap[0].style.perspectiveOrigin 			 = '50% ' + perspY + 'px';

		this.didScroll = false;
	};

	grid3D.prototype._resizeHandler = function() {
		var self = this;

		function delayed() {
			self._resizePlaceholder();
			self._scrollPage();
			self._resizeTimeout = null;
		}

		if (this._resizeTimeout) { clearTimeout(this._resizeTimeout); }
				this._resizeTimeout = setTimeout(delayed, 50);
	}

	grid3D.prototype._resizePlaceholder = function() {
		this.itemSize = {
			width  : this.gridItems[0].offsetWidth,
			height : this.gridItems[0].offsetHeight
		};

		if(this.placeholder) {
			var gridOffset = getOffset(this.grid);

			this.placeholder.style.left		= Number(-1 * (gridOffset.left - scrollX())) + 'px';
			this.placeholder.style.top		= Number(-1 * (gridOffset.top - scrollY())) + 'px';
			this.placeholder.style.width	= getViewportW() + 'px';
			this.placeholder.style.height = getViewportH() + 'px';
		}
	}

	window.grid3D = grid3D;
})(window);
