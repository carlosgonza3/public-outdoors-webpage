interface AmbientFieldProps {
  variant: 'intro' | 'purpose'
  fieldRef?: React.Ref<HTMLDivElement>
}

export function AmbientField({ variant, fieldRef }: AmbientFieldProps) {
  if (variant === 'purpose') {
    return (
      <div className="ambient-field ambient-field--purpose" ref={fieldRef} aria-hidden="true">
        <i className="purpose-glow purpose-glow--blue-main" />
        <i className="purpose-glow purpose-glow--green-main" />
        <i className="purpose-glow purpose-glow--blue-small" />
        <i className="purpose-glow purpose-glow--green-small" />
        <i className="purpose-glow purpose-glow--red-accent" />
      </div>
    )
  }

  return (
    <div className="ambient-field" ref={fieldRef} aria-hidden="true">
      <i className="ambient-glow ambient-glow--red" />
      <i className="ambient-glow ambient-glow--blue" />
      <i className="ambient-glow ambient-glow--green" />
    </div>
  )
}
