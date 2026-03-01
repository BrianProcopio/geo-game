import { useCallback, useEffect, useRef, useState } from 'react'
import { ScoreDisplay } from './ScoreDisplay'
import type { Location } from '~/data/locations'

interface GlobeViewProps {
  onLocationSelected: (location: Location) => void
  score: { correct: number; incorrect: number }
}

interface PinInfo {
  lat: number
  lng: number
  city: string
  country: string
}

export function GlobeView({ onLocationSelected, score }: GlobeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLElement | null>(null)
  const [pin, setPin] = useState<PinInfo | null>(null)
  const [geocoding, setGeocoding] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let cancelled = false

    async function init() {
      await customElements.whenDefined('gmp-map-3d')
      if (cancelled || !containerRef.current) return

      const map3d = document.createElement('gmp-map-3d')
      map3d.setAttribute('mode', 'hybrid')
      map3d.setAttribute('center', '20,0')
      map3d.setAttribute('range', '25000000')
      map3d.setAttribute('tilt', '0')
      map3d.setAttribute('heading', '0')
      map3d.style.width = '100%'
      map3d.style.height = '100%'

      containerRef.current.appendChild(map3d)
      mapRef.current = map3d

      map3d.addEventListener('gmp-click', ((e: Event) => {
        const clickEvent = e as Event & {
          position?: { lat: number; lng: number; altitude: number }
        }
        if (!clickEvent.position) return

        const { lat, lng } = clickEvent.position
        handleMapClick(lat, lng)
      }) as EventListener)
    }

    init()

    return () => {
      cancelled = true
      if (mapRef.current && containerRef.current) {
        containerRef.current.removeChild(mapRef.current)
        mapRef.current = null
      }
    }
  }, [])

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    setGeocoding(true)
    setPin(null)

    try {
      // @ts-expect-error google.maps.Geocoder loaded at runtime
      const geocoder = new google.maps.Geocoder()
      const result = await geocoder.geocode({
        location: { lat, lng },
      })

      let city = 'Unknown Location'
      let country = ''

      if (result.results.length > 0) {
        for (const component of result.results[0]!.address_components) {
          if (component.types.includes('locality')) {
            city = component.long_name
          }
          if (component.types.includes('administrative_area_level_1') && city === 'Unknown Location') {
            city = component.long_name
          }
          if (component.types.includes('country')) {
            country = component.long_name
          }
        }
      }

      setPin({ lat, lng, city, country: country || 'Unknown' })
    } catch {
      setPin({ lat, lng, city: 'Unknown Location', country: 'Unknown' })
    } finally {
      setGeocoding(false)
    }
  }, [])

  const handleConfirm = useCallback(() => {
    if (!pin) return
    onLocationSelected({
      city: pin.city,
      country: pin.country,
      lat: pin.lat,
      lng: pin.lng,
    })
  }, [pin, onLocationSelected])

  return (
    <div className="h-dvh flex flex-col bg-gray-900">
      <div className="relative flex-1 min-h-0">
        <div ref={containerRef} className="w-full h-full" />

        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-gray-900/80 text-white py-2 px-6 rounded-lg text-lg font-medium pointer-events-none">
          Click anywhere on the globe to drop a pin
        </div>

        {geocoding && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 bg-gray-800/90 text-gray-300 py-2 px-4 rounded-lg">
            Finding location...
          </div>
        )}

        {pin && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 bg-gray-900/90 p-4 rounded-xl shadow-2xl">
            <div className="text-white text-lg font-semibold">
              {pin.city}{pin.country ? `, ${pin.country}` : ''}
            </div>
            <button
              onClick={handleConfirm}
              className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-8 rounded-lg transition-colors cursor-pointer"
            >
              Play Here
            </button>
          </div>
        )}
      </div>

      <ScoreDisplay correct={score.correct} incorrect={score.incorrect} />
    </div>
  )
}
