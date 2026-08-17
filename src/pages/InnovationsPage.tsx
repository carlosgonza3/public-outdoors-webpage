import { CollectionPage } from './CollectionPage'
import { CollectionProjects } from '../components/CollectionProjects'
import { projectCollections } from '../data/projects'

interface InnovationsPageProps {
  modal?: boolean
}

const innovationsCollection = projectCollections.find(
  ({ id }) => id === 'innovations',
)!

export function InnovationsPage({ modal = false }: InnovationsPageProps) {
  return (
    <CollectionPage
      collectionId="innovations"
      label={innovationsCollection.label}
      modal={modal}
    >
      <header className="collection-page__header">
        <div className="collection-page__intro">
          <p>
            Nuevas tecnologías y experiencias que amplifican la relación entre
            marcas y audiencias.
          </p>
          <h1 aria-label={innovationsCollection.label}>
            <span className="collection-page__title-line">
              <span>{innovationsCollection.label}</span>
            </span>
          </h1>
        </div>
      </header>

      <CollectionProjects collection={innovationsCollection} />
    </CollectionPage>
  )
}
