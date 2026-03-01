import { useEffect } from 'react'
import { useStreetView } from '~/hooks/useStreetView'
import { ResultOverlay } from './ResultOverlay'
import type { Location } from '~/data/locations'
import type { Side } from '~/lib/game-logic'

interface StreetViewPanelProps {
  location: Location
  side: Side
  cityName: string
  ready: boolean
  onGuess: (side: Side) => void
  answer: 'correct' | 'incorrect' | null
  chosenSide: Side | null
  bothLoaded: boolean
  onLoaded: () => void
  onError: () => void
}

export function StreetViewPanel({
  location,
  side,
  cityName,
  ready,
  onGuess,
  answer,
  chosenSide,
  bothLoaded,
  onLoaded,
  onError,
}: StreetViewPanelProps) {
  const { containerRef, loading, error } = useStreetView({ location, ready })

  useEffect(() => {
    if (!loading && !error) {
      onLoaded()
    }
  }, [loading, error, onLoaded])

  useEffect(() => {
    if (error) {
      onError()
    }
  }, [error, onError])

  const showOverlay = answer !== null && chosenSide === side

  return (
    <div className="relative flex-1 flex flex-col min-h-0">
      <div ref={containerRef} className="flex-1 min-h-0 bg-gray-700" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 z-[5]">
          <div className="text-gray-400 text-lg">Loading Street View...</div>
        </div>
      )}

      {showOverlay && answer && (
        <ResultOverlay result={answer} cityName={location.city} country={location.country} />
      )}

      {bothLoaded && !answer && (
        <button
          onClick={() => onGuess(side)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/90 hover:bg-white text-gray-900 font-semibold py-3 px-5 sm:px-6 rounded-lg shadow-lg transition-colors cursor-pointer text-sm sm:text-base"
        >
          This is {cityName}
        </button>
      )}
    </div>
  )
}
