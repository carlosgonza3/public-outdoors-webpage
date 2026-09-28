import gsap from 'gsap'

const logo = document.querySelector('img')!
const button = document.querySelector('button')!
const media = gsap.matchMedia()

media.add('(prefers-reduced-motion: no-preference)', () => {
  // Reuse the full site's squash, bounce and elastic settling motion.
  const bounce = gsap.timeline({ paused: true })
    .to(logo, { y: 1.8, rotation: -2.4, scale: .88, duration: .1, ease: 'power2.in' })
    .to(logo, { y: -2.8, rotation: 2.8, scale: 1.16, duration: .22, ease: 'back.out(2.6)' })
    .to(logo, { y: .7, rotation: -1, scale: .97, duration: .16, ease: 'sine.inOut' })
    .to(logo, { y: 0, rotation: 0, scale: 1, duration: .34, ease: 'elastic.out(1, .5)' })
  const play = () => { if (!bounce.isActive()) bounce.restart() }
  const repeat = gsap.to({}, { duration: 4, repeat: -1, onRepeat: play })
  play()
  button.addEventListener('click', play)
  return () => {
    button.removeEventListener('click', play)
    repeat.kill()
    bounce.kill()
  }
})
