import { useState, type FormEvent } from 'react'
import { CollectionPage } from './CollectionPage'
import { ContactCard } from '../components/ContactCard'
import { LightboxImage } from '../components/ImageLightbox'
import { projectCollections } from '../data/projects'

interface InnovationsPageProps {
  modal?: boolean
}

const innovationsCollection = projectCollections.find(
  ({ id }) => id === 'innovations',
)!

export function InnovationsPage({ modal = false }: InnovationsPageProps) {
  const [idea, setIdea] = useState('')
  const [contactOpen, setContactOpen] = useState(false)
  const [ideaError, setIdeaError] = useState(false)
  const project = innovationsCollection.projects[0]

  const prepareIdeaEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = idea.trim()

    if (!message) {
      setIdeaError(true)
      return
    }

    const subject = encodeURIComponent('Nueva idea para innovar con Public')
    const body = encodeURIComponent(
      `Hola Public,\n\nTengo una idea que me gustaría explorar con ustedes:\n\n${message}\n\nMe gustaría conversar sobre cómo podríamos hacerla realidad.`,
    )

    window.location.href = `mailto:marketing@publicsv.net?subject=${subject}&body=${body}`
  }

  return (
    <>
      <CollectionPage
        collectionId="innovations"
        label={innovationsCollection.label}
        modal={modal}
      >
        <div className="innovations-page">
          <header className="collection-page__header innovations-hero">
            <div className="collection-page__intro innovations-hero__intro">
              <p>
                Tecnología, creatividad y producción para ideas que todavía no
                tienen formato.
              </p>
              <h1 aria-label={innovationsCollection.label}>
                <span className="collection-page__title-line">
                  <span>{innovationsCollection.label}</span>
                </span>
              </h1>
            </div>

            <div className="innovations-hero__statement">
              <h2>
                Si todavía no existe,
                <br />
                lo creamos juntos.
              </h2>
              <p>
                Trae una intuición, un reto o una idea imposible. Nosotros
                ponemos el espacio, la experiencia y la manera de hacerla
                visible.
              </p>
            </div>
          </header>

          <section
            className="collection-page__project innovations-proof"
            aria-labelledby="innovations-proof-title"
          >
            <div className="innovations-proof__media">
              <LightboxImage
                src={project.image!}
                alt={project.alt ?? project.title}
                caption="Innovations · Una idea hecha visible"
                triggerClassName="image-lightbox-trigger--fill"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="innovations-proof__caption">
              <p>Una muestra, no un catálogo.</p>
              <h2 id="innovations-proof-title">
                Cada innovación empieza con una conversación.
              </h2>
            </div>
          </section>

          <section
            className="innovations-invite"
            aria-labelledby="innovations-invite-title"
          >
            <div className="innovations-invite__heading">
              <span>Tu turno</span>
              <h2 id="innovations-invite-title">
                Cuéntanos lo que tienes en mente.
              </h2>
            </div>

            <form className="innovations-idea" onSubmit={prepareIdeaEmail}>
              <label htmlFor="innovation-idea">Quiero convertir…</label>
              <textarea
                id="innovation-idea"
                name="idea"
                rows={2}
                value={idea}
                placeholder="una calle, un espacio o una experiencia"
                aria-describedby={ideaError ? 'innovation-idea-error' : undefined}
                aria-invalid={ideaError || undefined}
                onChange={(event) => {
                  setIdea(event.target.value)
                  if (ideaError) setIdeaError(false)
                }}
              />
              {ideaError && (
                <p className="innovations-idea__error" id="innovation-idea-error">
                  Escribe tu idea en una frase para preparar el correo.
                </p>
              )}

              <div className="innovations-idea__actions">
                <button className="innovations-idea__submit" type="submit">
                  Preparar correo <span aria-hidden="true">↗</span>
                </button>
                <button
                  className="innovations-idea__contact"
                  type="button"
                  onClick={() => setContactOpen(true)}
                >
                  Ver formas de contacto
                </button>
              </div>
            </form>
          </section>
        </div>
      </CollectionPage>

      {contactOpen && <ContactCard onClose={() => setContactOpen(false)} />}
    </>
  )
}
