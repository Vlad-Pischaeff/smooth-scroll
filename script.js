const math = {
	lerp: (a, b, n) => {
		return (1 - n) * a + n * b
	},
	norm: (value, min, max) => {
	  	return (value - min) / (max - min)
	}
}

const config = {
  height: window.innerHeight,
  width: window.innerWidth
}

class Smooth {
  constructor() {
    this.bindMethods()

    this.data = {
      ease: 0.1,
      current: 0,
      last: 0
    }

    this.dom = {
      el: document.querySelector('[data-scroll]'),
      content: document.querySelector('[data-scroll-content]')
    }

    this.rAF = null
    this.trigger = false
    
    this.init()
  }

  bindMethods() {
    ['scroll', 'run', 'resize']
    .forEach((fn) => this[fn] = this[fn].bind(this))
  }

  setHeight() {
    document.body.style.height = `${this.dom.content.offsetHeight}px`
  }

  resize() {
    this.setHeight()
    this.scroll()
  }

  preload() {
    imagesLoaded(this.dom.content, (instance) => {
      this.setHeight()
    })
  }

  scroll() {
    this.data.current = window.scrollY
    if (!this.trigger) {
      this.trigger = true
      this.run()
    }
  }

  run() {
    this.data.last = math.lerp(this.data.last, this.data.current, this.data.ease)
    if (this.data.last < .1) {
      this.data.last = 0
    }
    
    const diff = this.data.current - this.data.last
    const acc = diff / config.width
    const velo =+ acc
    const skew = velo * 7.5
    const scale = diff > 0 ? 1 - diff/15000 : 1 + diff/15000
    const op = diff > 0 ? 1 - diff/1000 : 1 + diff/1000
    
    this.dom.content.style.transform = `translate3d(0, -${this.data.last}px, 0) skewY(${skew}deg) scale(${scale}, ${scale})`
    this.dom.content.style.opacity = op
   
    if (op > 0.999) {
       this.trigger = false
    }

    if (this.trigger) {
      this.requestAnimationFrame()
    }
  }

  on() { 
    this.addEvents()
    this.requestAnimationFrame()
  }

  off() {
    this.cancelAnimationFrame()
    this.removeEvents()
  }

  requestAnimationFrame() {
    this.rAF = requestAnimationFrame(this.run)
  }

  cancelAnimationFrame() {
    cancelAnimationFrame(this.rAF)
  }

  destroy() {
    document.body.style.height = ''

    this.data = null

    this.removeEvents()
    this.cancelAnimationFrame()
  }

  resize() {
    this.setHeight()
  }

  addEvents() {
    window.addEventListener('resize', this.resize, { passive: true })
    window.addEventListener('scroll', this.scroll, { passive: true })
  }

  removeEvents() {
    window.removeEventListener('resize', this.resize, { passive: true })
    window.removeEventListener('scroll', this.scroll, { passive: true })
  }

  init() {
    this.preload()
    this.on()
  }
}

new Smooth()
