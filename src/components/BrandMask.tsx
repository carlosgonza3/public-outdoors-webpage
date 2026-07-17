interface BrandMaskProps {
  veilRef: React.Ref<SVGSVGElement>
  markRef: React.Ref<SVGGElement>
  colorMarkRef: React.Ref<SVGGElement>
}

const MarkPaths = ({ color }: { color: string }) => (
  <>
    <path d="M43.0353 26.6296L44.4875 2.77441L34.9963 4.44748L35.902 16.4822L31.1837 39.0645L29.9401 43.0015L37.3543 37.6176L43.0353 26.6296Z" fill={color} />
    <path d="M37.3544 37.6178L21.248 49.1966C21.248 49.1966 19.4579 39.5513 31.8109 31.1765C36.144 30.2517 37.3556 37.6189 37.3556 37.6189L37.3544 37.6178Z" fill={color} />
    <path d="M0 46.4197C0 46.4197 3.40361 27.4772 22.162 26.1996L12.6293 18.3623L15.3678 2.7624L33.3853 0L43.0354 26.6294L37.3544 37.6174L8.36617 44.4104L0 46.4197Z" fill={color} />
  </>
)

export function BrandMask({ veilRef, markRef, colorMarkRef }: BrandMaskProps) {
  return (
    <svg
      ref={veilRef}
      className="logo-veil"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <mask id="mark-cutout">
          <rect width="1000" height="1000" fill="white" />
          <g transform="translate(500 500)">
            <g ref={markRef}>
              <g transform="translate(-22.25 -25)">
                <MarkPaths color="black" />
              </g>
            </g>
          </g>
        </mask>
      </defs>
      <rect width="1000" height="1000" fill="#f7f5ef" mask="url(#mark-cutout)" />
      <g transform="translate(500 500)">
        <g ref={colorMarkRef}>
          <g transform="translate(-22.25 -25)">
            <path d="M43.0353 26.6296L44.4875 2.77441L34.9963 4.44748L35.902 16.4822L31.1837 39.0645L29.9401 43.0015L37.3543 37.6176L43.0353 26.6296Z" fill="#00B0F4" />
            <path d="M37.3544 37.6178L21.248 49.1966C21.248 49.1966 19.4579 39.5513 31.8109 31.1765C36.144 30.2517 37.3556 37.6189 37.3556 37.6189L37.3544 37.6178Z" fill="#38D430" />
            <path d="M0 46.4197C0 46.4197 3.40361 27.4772 22.162 26.1996L12.6293 18.3623L15.3678 2.7624L33.3853 0L43.0354 26.6294L37.3544 37.6174L8.36617 44.4104L0 46.4197Z" fill="#FF0109" />
          </g>
        </g>
      </g>
    </svg>
  )
}
