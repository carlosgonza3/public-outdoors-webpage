type SectionAmbientProps = {
  variant: 'team' | 'history'
}

export function SectionAmbient({ variant }: SectionAmbientProps) {
  return (
    <div
      className={`section-ambient section-ambient--${variant}`}
      aria-hidden="true"
    >
      <i className="section-ambient__orb section-ambient__orb--red" />
      <i className="section-ambient__orb section-ambient__orb--blue" />
      <i className="section-ambient__orb section-ambient__orb--green" />
      <span className="section-ambient__glass" />
    </div>
  )
}
