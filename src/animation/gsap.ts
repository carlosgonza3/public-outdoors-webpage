import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(Observer, ScrollTrigger, useGSAP)
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, Observer, ScrollTrigger, useGSAP }
