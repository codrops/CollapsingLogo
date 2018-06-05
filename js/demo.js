/**
 * demo.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2018, Codrops
 * http://www.codrops.com
 */
{
	// From https://davidwalsh.name/javascript-debounce-function.
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	let winsize = {width: window.innerWidth, height: window.innerHeight};

	const DOM = {
		intro: document.querySelector('.intro'),
		slideshowImagesWrappers: document.querySelectorAll('.slideshow__item-img'),
		slideshowImages: document.querySelectorAll('.slideshow__item-img-inner')
	};
	
	class Panel {
		constructor(el) {
			this.DOM = {el: el};

			this.DOM.logo = DOM.intro.querySelector('.intro__logo');
			this.DOM.logoImg = this.DOM.logo.querySelector('.icon--arrowup');
			this.DOM.enter = DOM.intro.querySelector('.intro__enter');
			
			this.animatableElems = Array.from(DOM.intro.querySelectorAll('.animatable')).sort(() => 0.5 - Math.random());
			
			// set layout
			this.boxRect = this.DOM.el.getBoundingClientRect();
			this.layout();

			this.isOpen = true;
			this.initEvents();
		}
		layout() {
			this.DOM.el.style.transform = `scaleX(${winsize.width/this.boxRect.width}) scaleY(${winsize.height/this.boxRect.height})`;
			document.body.classList.remove('loading');
		}
		initEvents() {
			this.DOM.enter.addEventListener('click', (ev) => {
				ev.preventDefault();
				this.close();
			});
		
			this.DOM.logo.addEventListener('click', (ev) => {
				ev.preventDefault();
				this.open();
			});

			// Window resize
			this.onResize = () => {
				winsize = {width: window.innerWidth, height: window.innerHeight};
				if ( this.isOpen ) {
					this.layout();
				}
			};
			window.addEventListener('resize', debounce(() => this.onResize(), 10));
		}
		open() {
			if ( this.isOpen || this.isAnimating ) return;
			this.isOpen = true;
			this.isAnimating = true;

			DOM.intro.style.pointerEvents = 'auto';

			anime.remove(this.DOM.logoImg);
			anime({
				targets: this.DOM.logoImg,
				translateY: [{value: '-400%', duration: 200, easing: 'easeOutQuad'}, {value: ['200%', '0%'], duration: 700, easing: 'easeOutExpo'}]
			});

			anime.remove(this.animatableElems);
			anime({
				targets: this.animatableElems,
				duration: 1200,
				delay: (t,i) => 350 + i*30,
				easing: 'easeOutExpo',
				translateX: '0%',
				opacity: {
					value: 1,
					easing: 'linear',
					duration: 400
				}
			});

			const boxRect = this.DOM.el.getBoundingClientRect();
			anime.remove(this.DOM.el);
			anime({
				targets: this.DOM.el,
				scaleX: {value: winsize.width/boxRect.width, duration: 700, delay: 300, easing: 'easeOutExpo'},
				scaleY: {value: winsize.height/boxRect.height, duration: 300, easing: 'easeOutQuad'},
				complete: () => this.isAnimating = false
			});
		}
		close() {
			if ( !this.isOpen || this.isAnimating ) return;
			this.isOpen = false;
			this.isAnimating = true;

			DOM.intro.style.pointerEvents = 'none';

			anime.remove(this.DOM.logoImg);
			anime({
				targets: this.DOM.logoImg,
				translateY: [{value: '-400%', duration: 300, easing: 'easeOutQuad'}, {value: ['200%', '0%'], duration: 700, easing: 'easeOutExpo'}],
				rotate: [{value: 0, duration: 300}, {value: [90,0], duration: 1300, easing: 'easeOutElastic'}]
			});

			anime.remove(this.animatableElems);
			anime({
				targets: this.animatableElems,
				duration: 150,
				easing: 'easeOutQuad',
				translateX: '-30%',
				opacity: 0
			});

			anime.remove(this.DOM.el);
			anime({
				targets: this.DOM.el,
				duration: 1000,
				scaleX: {value: 1, duration: 300, easing: 'easeOutQuad'},
				scaleY: {value: 1, duration: 700, delay: 300, easing: 'easeOutExpo'},
				complete: () => this.isAnimating = false
			});

			anime.remove(DOM.slideshowImages);
			anime({
				targets: DOM.slideshowImages,
				duration: 1000,
				delay: (t,i) => i*60,
				easing: 'easeOutCubic',
				scale: [1.5,1]
			});
			anime.remove(DOM.slideshowImagesWrappers);
			anime({
				targets: DOM.slideshowImagesWrappers,
				duration: 1000,
				delay: (t,i) => i*60,
				easing: 'easeOutCubic',
				translateY: ['10%','0%']
			});
		}
	}

	const panel = new Panel(DOM.intro.querySelector('.intro__box'));
}
