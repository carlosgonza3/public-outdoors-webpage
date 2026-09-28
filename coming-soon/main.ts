import gsap from 'gsap'

const logo = document.querySelector('img')!
const button = document.querySelector('button')!
const media = gsap.matchMedia()

media.add('(prefers-reduced-motion: no-preference)', () => {
  const animation = gsap.timeline({ paused: true })
  let presses = 0
  let locked = false
  let resetTimer: number | undefined

  const bounce = () => {
    animation.pause().clear()
      .to(logo, { y: 1.8, rotation: -2.4, scale: .88, duration: .1, ease: 'power2.in' })
      .to(logo, { y: -2.8, rotation: 2.8, scale: 1.16, duration: .22, ease: 'back.out(2.6)' })
      .to(logo, { y: .7, rotation: -1, scale: .97, duration: .16, ease: 'sine.inOut' })
      .to(logo, { y: 0, rotation: 0, scale: 1, duration: .34, ease: 'elastic.out(1, .5)' })
      .restart()
  }

  const click = () => {
    if (locked) return
    window.clearTimeout(resetTimer)
    presses += 1
    if (presses < 3) {
      resetTimer = window.setTimeout(() => { presses = 0 }, 900)
      bounce()
      return
    }

    presses = 0
    locked = true
    animation.pause().clear()
      .to(logo, { y: 2.4, rotation: -5, scale: .84, duration: .08, ease: 'power2.in' })
      .to(logo, { y: -18, rotation: 180, scale: 1.1, duration: .25, ease: 'power3.out' })
      .to(logo, { y: 0, rotation: 360, scale: .95, duration: .3, ease: 'power2.in' })
      .to(logo, { y: -1.2, scale: 1.06, duration: .1, ease: 'power2.out' })
      .to(logo, {
        y: 0, rotation: 360, scale: 1, duration: .18, ease: 'back.out(2.4)',
        onComplete: () => {
          gsap.set(logo, { rotation: 0 })
          locked = false
        },
      })
      .restart()
  }

  const repeat = gsap.to({}, {
    duration: 4, repeat: -1,
    onRepeat: () => { if (!locked && !presses && !animation.isActive()) bounce() },
  })
  bounce()
  button.addEventListener('click', click)
  return () => {
    window.clearTimeout(resetTimer)
    button.removeEventListener('click', click)
    repeat.kill()
    animation.kill()
    gsap.set(logo, { clearProps: 'transform' })
  }
})

if (import.meta.hot) import.meta.hot.dispose(() => media.revert())
