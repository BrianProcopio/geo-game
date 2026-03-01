import { createContext, useContext, useEffect, useState } from 'react'

export const GoogleMapsContext = createContext<boolean>(false)

export function useGoogleMapsReady() {
  return useContext(GoogleMapsContext)
}

export function useGoogleMapsLoader() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (window.google?.maps) {
      setReady(true)
      return
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.error(
        'Google Maps API key not configured. Set VITE_GOOGLE_MAPS_API_KEY in .env',
      )
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=maps3d&loading=async`
    script.async = true
    script.defer = true
    script.onload = () => setReady(true)
    script.onerror = () => console.error('Failed to load Google Maps API')
    document.head.appendChild(script)
  }, [])

  return ready
}
