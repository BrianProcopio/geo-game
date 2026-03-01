import { useEffect, useRef, useState } from 'react'
import type { Location } from '~/data/locations'

interface UseStreetViewOptions {
  location: Location | null
  ready: boolean
}

export function useStreetView({ location, ready }: UseStreetViewOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!ready || !location || !containerRef.current) return

    let cancelled = false

    setLoading(true)
    setError(false)

    const sv = new google.maps.StreetViewService()
    sv.getPanorama(
      {
        location: { lat: location.lat, lng: location.lng },
        radius: 500,
        source: google.maps.StreetViewSource.OUTDOOR,
      },
      (data, status) => {
        if (cancelled) return
        if (
          status === google.maps.StreetViewStatus.OK &&
          data?.location?.latLng &&
          containerRef.current
        ) {
          if (panoramaRef.current) {
            panoramaRef.current.setPosition(data.location.latLng)
            panoramaRef.current.setPov({
              heading: Math.random() * 360,
              pitch: 0,
            })
          } else {
            panoramaRef.current = new google.maps.StreetViewPanorama(
              containerRef.current,
              {
                position: data.location.latLng,
                pov: {
                  heading: Math.random() * 360,
                  pitch: 0,
                },
                scrollwheel: false,
                zoomControl: false,
                panControl: true,
                linksControl: true,
                clickToGo: true,
                addressControl: false,
                showRoadLabels: false,
                fullscreenControl: false,
                motionTrackingControl: false,
                enableCloseButton: false,
              },
            )
          }
          setLoading(false)
        } else {
          setError(true)
          setLoading(false)
        }
      },
    )

    return () => {
      cancelled = true
    }
  }, [location, ready])

  return { containerRef, loading, error }
}
