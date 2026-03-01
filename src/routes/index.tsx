import { useCallback, useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { GoogleMapsContext, useGoogleMapsLoader } from '~/hooks/useGoogleMaps'
import { useGameState } from '~/hooks/useGameState'
import { GameBoard } from '~/components/GameBoard'
import { GlobeView } from '~/components/GlobeView'
import type { Location } from '~/data/locations'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const ready = useGoogleMapsLoader()
  const { state, guess, startRound, retry, reset } = useGameState()
  const [phase, setPhase] = useState<'globe' | 'playing'>('globe')
  const [score, setScore] = useState({ correct: 0, incorrect: 0 })
  const prevAnswer = useRef(state.answer)
  const errorRetries = useRef(0)
  const MAX_ERROR_RETRIES = 5

  // Track score when answer changes
  useEffect(() => {
    if (state.answer && !prevAnswer.current) {
      setScore((s) => ({
        correct: s.correct + (state.answer === 'correct' ? 1 : 0),
        incorrect: s.incorrect + (state.answer === 'incorrect' ? 1 : 0),
      }))
    }
    prevAnswer.current = state.answer
  }, [state.answer])

  const handleLocationSelected = useCallback(
    (location: Location) => {
      errorRetries.current = 0
      startRound(location)
      setPhase('playing')
    },
    [startRound],
  )

  const handleSelectNew = useCallback(() => {
    errorRetries.current = 0
    reset()
    setPhase('globe')
  }, [reset])

  const handleRetry = useCallback(() => {
    errorRetries.current = 0
    retry()
  }, [retry])

  const handleError = useCallback(() => {
    if (phase === 'playing' && errorRetries.current < MAX_ERROR_RETRIES) {
      errorRetries.current++
      retry()
    } else {
      errorRetries.current = 0
      reset()
      setPhase('globe')
    }
  }, [phase, retry, reset])

  return (
    <GoogleMapsContext.Provider value={ready}>
      {phase === 'globe' && (
        <GlobeView onLocationSelected={handleLocationSelected} score={score} />
      )}
      {phase === 'playing' && state.round && (
        <GameBoard
          round={state.round}
          answer={state.answer}
          chosenSide={state.chosenSide}
          score={score}
          onGuess={guess}
          onError={handleError}
          onSelectNew={handleSelectNew}
          onRetry={handleRetry}
        />
      )}
    </GoogleMapsContext.Provider>
  )
}
