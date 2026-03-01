import { useCallback, useEffect, useState } from 'react'
import { useGoogleMapsReady } from '~/hooks/useGoogleMaps'
import { getLocationForSide } from '~/lib/game-logic'
import { CityPrompt } from './CityPrompt'
import { PostAnswerOverlay } from './PostAnswerOverlay'
import { ScoreDisplay } from './ScoreDisplay'
import { StreetViewPanel } from './StreetViewPanel'
import type { Round, Side } from '~/lib/game-logic'

interface GameBoardProps {
  round: Round
  answer: 'correct' | 'incorrect' | null
  chosenSide: Side | null
  score: { correct: number; incorrect: number }
  onGuess: (side: Side) => void
  onError: () => void
  onSelectNew: () => void
  onRetry: () => void
}

export function GameBoard({
  round,
  answer,
  chosenSide,
  score,
  onGuess,
  onError,
  onSelectNew,
  onRetry,
}: GameBoardProps) {
  const ready = useGoogleMapsReady()
  const [panelsLoaded, setPanelsLoaded] = useState({ left: false, right: false })

  const bothLoaded = panelsLoaded.left && panelsLoaded.right

  useEffect(() => {
    setPanelsLoaded({ left: false, right: false })
  }, [round])

  const handleLeftLoaded = useCallback(() => {
    setPanelsLoaded((prev) => ({ ...prev, left: true }))
  }, [])

  const handleRightLoaded = useCallback(() => {
    setPanelsLoaded((prev) => ({ ...prev, right: true }))
  }, [])

  if (!ready) {
    return (
      <div className="h-dvh flex items-center justify-center bg-gray-900">
        <div className="text-gray-400 text-xl">Loading Google Maps...</div>
      </div>
    )
  }

  const leftLocation = getLocationForSide(round, 'left')
  const rightLocation = getLocationForSide(round, 'right')

  return (
    <div className="h-dvh flex flex-col">
      <CityPrompt
        city={round.correctLocation.city}
        country={round.correctLocation.country}
      />

      <div className="relative flex-1 flex flex-row min-h-0">
        <StreetViewPanel
          location={leftLocation}
          side="left"
          cityName={round.correctLocation.city}
          ready={ready}
          onGuess={onGuess}
          answer={answer}
          chosenSide={chosenSide}
          bothLoaded={bothLoaded}
          onLoaded={handleLeftLoaded}
          onError={onError}
        />
        <div className="w-px bg-gray-600" />
        <StreetViewPanel
          location={rightLocation}
          side="right"
          cityName={round.correctLocation.city}
          ready={ready}
          onGuess={onGuess}
          answer={answer}
          chosenSide={chosenSide}
          bothLoaded={bothLoaded}
          onLoaded={handleRightLoaded}
          onError={onError}
        />

        {answer && chosenSide && (
          <PostAnswerOverlay
            result={answer}
            correctLocation={round.correctLocation}
            chosenSide={chosenSide}
            onSelectNew={onSelectNew}
            onRetry={onRetry}
          />
        )}
      </div>

      <ScoreDisplay correct={score.correct} incorrect={score.incorrect} />
    </div>
  )
}
