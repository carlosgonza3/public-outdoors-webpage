export interface PageMetadata {
  title: string
  description: string
  noindex?: boolean
}

export const pages: Record<string, PageMetadata> = {
  '/': {
    title: 'PUBLIC | Publicidad exterior e indoor en El Salvador',
    description: 'Conecta tu marca con las personas con PUBLIC. Publicidad exterior, medios indoor y soluciones innovadoras en El Salvador. Conoce nuestros espacios.',
  },
  '/indoor': {
    title: 'Publicidad indoor en El Salvador | PUBLIC',
    description: 'Descubre los medios indoor de PUBLIC: pantallas y espacios publicitarios en centros comerciales para conectar tu marca con las personas.',
  },
  '/outdoor': {
    title: 'Publicidad exterior en El Salvador | PUBLIC',
    description: 'Conoce los medios outdoor de PUBLIC: vallas, pantallas digitales y publicidad de gran formato en puntos estratégicos de El Salvador.',
  },
  '/innovations': {
    title: 'Innovación publicitaria en El Salvador | PUBLIC',
    description: 'Explora propuestas de PUBLIC que combinan creatividad, tecnología y nuevos formatos para transformar la presencia de tu marca en El Salvador.',
  },
  '/disponibilidad': {
    title: 'Disponibilidad de espacios publicitarios | PUBLIC',
    description: 'Próximamente podrás consultar la disponibilidad de espacios publicitarios de PUBLIC en El Salvador.',
    noindex: true,
  },
}

export const notFound: PageMetadata = {
  title: 'Página no encontrada | PUBLIC',
  description: 'La página que buscas no está disponible. Vuelve al inicio para conocer PUBLIC.',
  noindex: true,
}

export function pageUrl(siteUrl: string, path: string) {
  return `${siteUrl.replace(/\/$/, '')}${path === '/' ? '/' : `${path}/`}`
}
