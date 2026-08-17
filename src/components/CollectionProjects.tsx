import type { ProjectCollection } from '../data/projects'
import { LightboxImage } from './ImageLightbox'

interface CollectionProjectsProps {
  collection: ProjectCollection
}

export function CollectionProjects({ collection }: CollectionProjectsProps) {
  return (
    <section
      className="collection-page__projects"
      aria-label={`Proyectos ${collection.label}`}
    >
      {collection.projects.map((project, index) => (
        <article className="collection-page__project" key={project.id}>
          <div
            className={`collection-page__visual ${
              project.image
                ? 'collection-page__visual--image'
                : `collection-page__visual--${project.tone}`
            }`}
          >
            {project.image ? (
              <LightboxImage
                src={project.image}
                alt={project.alt ?? project.title}
                caption={project.title}
                triggerClassName="image-lightbox-trigger--fill"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            ) : (
              <span>{project.id}</span>
            )}
          </div>
          <div className="collection-page__project-meta">
            <span>{project.id}</span>
            <h2>{project.title}</h2>
          </div>
        </article>
      ))}
    </section>
  )
}
