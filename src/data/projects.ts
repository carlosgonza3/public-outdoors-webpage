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
  description: string
  projects: Project[]
}

export const projectCollections: ProjectCollection[] = [
  {
    id: 'indoor',
    label: 'INDOOR',
    description:
      'Presencia estratégica en espacios donde las personas esperan, compran y se conectan.',
    projects: [
      {
        id: '01',
        title: 'LED Ramblas',
        image: indoorOne,
        alt: 'Pantalla publicitaria digital dentro de un centro comercial',
      },
      {
        id: '02',
        title: 'Cilindro Digital Ramblas',
        image: indoorTwo,
        alt: 'Cilindro publicitario digital en un centro comercial',
      },
      {
        id: '03',
        title: 'Cilindro Fijo Ramblas',
        image: indoorThree,
        alt: 'Publicidad indoor de Public Outdoors en un centro comercial',
      },
    ],
  },
  {
    id: 'outdoor',
    label: 'OUTDOOR',
    description:
      'Impacto de gran formato en puntos clave que acompañan a las personas durante sus recorridos.',
    projects: [
      {
        id: '04',
        title: 'Parada de buses',
        image: outdoorOne,
        alt: 'Parada de buses con publicidad de Coca-Cola en San Salvador',
      },
      {
        id: '05',
        title: 'Valla fija',
        image: outdoorTwo,
        alt: 'Valla publicitaria de gran formato junto a una vía de San Salvador',
      },
      {
        id: '06',
        title: 'Pantalla digital',
        image: outdoorThree,
        alt: 'Pantalla digital y banderola publicitaria junto a una vía urbana',
      },
    ],
  },
  {
    id: 'innovations',
    label: 'INNOVATIONS',
    description:
      'Experiencias fuera de lo común que transforman ideas audaces en conexiones memorables.',
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
