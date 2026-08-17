import { CollectionPage } from './CollectionPage'
import { CollectionProjects } from '../components/CollectionProjects'
import { projectCollections } from '../data/projects'

interface IndoorPageProps {
  modal?: boolean
}

const indoorCollection = projectCollections.find(({ id }) => id === 'indoor')!

export function IndoorPage({ modal = false }: IndoorPageProps) {
  return (
    <CollectionPage
      collectionId="indoor"
      label={indoorCollection.label}
      modal={modal}
    >
      <header className="collection-page__header">
        <div className="collection-page__intro">
          <p>
            Presencia estratégica en espacios donde las personas esperan, compran
            y se conectan.
          </p>
          <h1 aria-label={indoorCollection.label}>
            <span className="collection-page__title-line">
              <span>{indoorCollection.label}</span>
            </span>
          </h1>
        </div>
      </header>

      <CollectionProjects collection={indoorCollection} />
    </CollectionPage>
  )
}
