let Rubber = function(args){

	// Argument checking
	let minWidth = (typeof args.minwidth === 'number') ? args.minwidth : 1280
	let interactiveElements = (Array.isArray( args.interactives )) ? args.interactives : ['a', 'input', 'select', 'button', 'textarea', 'label[for]', '*[data-rubber]']
	interactiveElements = interactiveElements.join(',')

	// Markup injection
	const domRubber = document.createElement('div')
	domRubber.id = 'rubber'
	document.body.appendChild(domRubber)
	
	// Style injection
	const sheet = document.createElement('style')
	const cssrules = `
	#rubber {
		display: none;
	}
	@media (min-width: ${minWidth}px) {
		* {
			cursor: none !important;
		}
		
		#rubber {
			display: block;
			position: fixed;
			mix-blend-mode: difference;
			z-index: 100;
			pointer-events: none;
			opacity: 0;
			top: -15px;
			left: -15px;
			width: 30px;
			height: 30px;
		}
		
		#rubber.rubber-init {
			opacity: 1;
			transition: opacity .3s cubic-bezier(.3, .5, .5, 1)
		}
		
		#rubber:before {
			content: "";
			display: block;
			border-radius: 50%;
			background-color: #fff;
			transform: scale(.3);
			transition: transform .6s cubic-bezier(.3, 1, .3, 1);
			width: 100%;
			height: 100%;
		}
		
		#rubber.rubber-hover:before {
			transform: scale(1);
		}
	}
	`
	sheet.innerHTML = cssrules
	document.head.appendChild(sheet)
	
	// pmouse saves previous mouse position
	// hover whether it's hovering an interactive element
	let pmouse = { x: 0, y: 0 }
	let mouse = { x: 0, y: 0 }
	let hover = false
	let outside = true
	const cursor = document.querySelector('#rubber')
	
	// Animation cycle
	function render() {
		window.requestAnimationFrame(render)
	
		// t denotes the amount of distortion, which is less when cursor is larger
		let t = hover ? 15 : 30
		let dx = pmouse.x - mouse.x
		let dy = pmouse.y - mouse.y
		let s = Math.max(1, Math.min(t, Math.sqrt(dx * dx + dy * dy)) / 10 )
		let r = 180 * Math.atan2(dy, dx) / Math.PI
	
		const transform = 'translate(' + mouse.x + 'px, ' + mouse.y + 'px) rotate(' + r + 'deg) scaleX(' + s + ')'
		cursor.style.transform = transform
	
		pmouse = {x: mouse.x, y: mouse.y}
	
	}
	
	// Eventlisteners on document for mouse tracking
	document.addEventListener('mousemove', e => {
		mouse = { x: e.clientX, y: e.clientY }
		if(outside) {
			cursor.classList.add('rubber-init')
			outside = false
		}
	}, false)
	document.addEventListener('mouseout', e => {
		if(e.relatedTarget !== null) return
		cursor.classList.remove('rubber-init')
		outside = true
	}, false)
	
	// Resize cursor on links
	const ies = document.querySelectorAll( interactiveElements )
	ies.forEach(el => {
		el.addEventListener('mouseenter', () => {
			cursor.classList.add('rubber-hover')
			hover = true
		})
		el.addEventListener('mouseleave', () => {
			cursor.classList.remove('rubber-hover')
			hover = false
		})
	})
	
	// Kick off animation
	render()
}