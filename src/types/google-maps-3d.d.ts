declare namespace JSX {
  interface IntrinsicElements {
    'gmp-map-3d': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        center?: string
        range?: string
        tilt?: string
        heading?: string
      },
      HTMLElement
    >
  }
}
