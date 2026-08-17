import { CollectionPage } from './CollectionPage'
import { CollectionProjects } from '../components/CollectionProjects'
import { projectCollections } from '../data/projects'

interface OutdoorPageProps {
  modal?: boolean
}

const outdoorCollection = projectCollections.find(({ id }) => id === 'outdoor')!

export function OutdoorPage({ modal = false }: OutdoorPageProps) {
  return (
    <CollectionPage
      collectionId="outdoor"
      label={outdoorCollection.label}
      modal={modal}
    >
      <header className="collection-page__header">
        <div className="collection-page__intro">
          <p>
            Formatos de alto impacto que convierten la ciudad y sus recorridos en
            oportunidades.
          </p>
          <h1 aria-label={outdoorCollection.label}>
            <span className="collection-page__title-line">
              <span>{outdoorCollection.label}</span>
            </span>
          </h1>
        </div>
      </header>

      <CollectionProjects collection={outdoorCollection} />
    </CollectionPage>
  )
}
