var docElem = window.document.documentElement,
		transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition'		 : 'transitionend',
			'OTransition'			 : 'oTransitionEnd',
			'msTransition'		 : 'MSTransitionEnd',
			'transition'			 : 'transitionend'
		},

		transEndEventName = transEndEventNames[
			Modernizr.prefixed('transition')
		],

		support = {
			pointerevents 	: Modernizr.pointerevents,
			csstransitions 	: Modernizr.csstransitions,
			csstransforms3d : Modernizr.csstransforms3d
		};

function randomize(content) { return Math.floor(Math.random() * content.length) }

function isIOSSafari() {
	var userAgent = window.navigator.userAgent;
	return userAgent.match(/iPad/i) || userAgent.match(/iPhone/i);
};

function isTouch() {
	var isIETouch = navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
	return [].indexOf.call(window, 'ontouchstart') >= 0 || isIETouch;
};

function scrollX() { return window.pageXOffset || docElem.scrollLeft; }
function scrollY() { return window.pageYOffset || docElem.scrollTop; }

function getOffset(element) {
	var offset = element[0].getBoundingClientRect();
	return {
		top  : offset.top + scrollY(),
		left : offset.left + scrollX()
	};
}

function getViewportW() {
	var client = docElem['clientWidth'],
			inner = window['innerWidth'];

	if(client < inner) {
		return inner;
	} else {
		return client;
	}
}

function getViewportH() {
	var client = docElem['clientHeight'],
			inner = window['innerHeight'];

	if(client < inner) {
		return inner;
	} else {
		return client;
	}
}

function extend(a, b) {
	for(var key in b) {
		if(b.hasOwnProperty(key)) { a[key] = b[key]; }
	}

	return a;
}
