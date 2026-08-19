import indoorOne from '../assets/images/indoor-1.webp'
import indoorTwo from '../assets/images/indoor-2.webp'
import indoorThree from '../assets/images/indoor-3.webp'
import innovationsOne from '../assets/images/innovations-1.webp'
import outdoorOne from '../assets/images/outdoor-1.webp'
import outdoorTwo from '../assets/images/outdoor-2.webp'
import outdoorThree from '../assets/images/outdoor-3.webp'

export type ProjectTone = 'red' | 'blue' | 'green'

export interface Project {
  id: string
  title: string
  image?: string
  alt?: string
  tone?: ProjectTone
}

export interface ProjectCollection {
  id: 'indoor' | 'outdoor' | 'innovations'
  label: string
  projects: Project[]
}

export const projectCollections: ProjectCollection[] = [
  {
    id: 'indoor',
    label: 'INDOOR',
    projects: [
      { id: '01', title: 'Indoor 01', image: indoorOne, alt: 'Indoor project 1' },
      { id: '02', title: 'Indoor 02', image: indoorTwo, alt: 'Indoor project 2' },
      {
        id: '03',
        title: 'Indoor 03',
        image: indoorThree,
        alt: 'Publicidad indoor de Public Outdoors en un centro comercial',
      },
    ],
  },
  {
    id: 'outdoor',
    label: 'OUTDOOR',
    projects: [
      { id: '04', title: 'Outdoor 01', image: outdoorOne, alt: 'Outdoor project 1' },
      { id: '05', title: 'Outdoor 02', image: outdoorTwo, alt: 'Outdoor project 2' },
      { id: '06', title: 'Outdoor 03', image: outdoorThree, alt: 'Outdoor project 3' },
    ],
  },
  {
    id: 'innovations',
    label: 'INNOVATIONS',
    projects: [
      {
        id: '07',
        title: 'Innovations 01',
        image: innovationsOne,
        alt: 'Instalación publicitaria innovadora de Burger King',
      },
    ],
  },
]
