import { useCallback, useReducer } from 'react'
import { locations } from '~/data/locations'
import { createRound, isCorrectGuess } from '~/lib/game-logic'
import { pickNearbyDecoy } from '~/lib/geo'
import type { Location } from '~/data/locations'
import type { Round, Side } from '~/lib/game-logic'

interface GameState {
  round: Round | null
  answer: 'correct' | 'incorrect' | null
  chosenSide: Side | null
  selectedLocation: Location | null
}

type GameAction =
  | { type: 'START_ROUND'; location: Location }
  | { type: 'GUESS'; side: Side }
  | { type: 'RETRY' }
  | { type: 'RESET' }

/** Offset lat/lng by a random amount (~0.5–2 km) to land on a different street */
function randomizeStreet(location: Location): Location {
  const offsetKm = 0.5 + Math.random() * 1.5
  const angle = Math.random() * 2 * Math.PI
  const latOffset = (offsetKm / 111) * Math.cos(angle)
  const lngOffset =
    (offsetKm / (111 * Math.cos((location.lat * Math.PI) / 180))) *
    Math.sin(angle)
  return {
    ...location,
    lat: location.lat + latOffset,
    lng: location.lng + lngOffset,
  }
}

function initState(): GameState {
  return {
    round: null,
    answer: null,
    chosenSide: null,
    selectedLocation: null,
  }
}

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_ROUND': {
      const decoy = pickNearbyDecoy(action.location, locations)
      return {
        round: createRound(action.location, decoy),
        answer: null,
        chosenSide: null,
        selectedLocation: action.location,
      }
    }
    case 'GUESS': {
      if (!state.round || state.answer) return state
      const correct = isCorrectGuess(state.round, action.side)
      return {
        ...state,
        answer: correct ? 'correct' : 'incorrect',
        chosenSide: action.side,
      }
    }
    case 'RETRY': {
      if (!state.selectedLocation) return state
      const newStreet = randomizeStreet(state.selectedLocation)
      const decoy = pickNearbyDecoy(state.selectedLocation, locations)
      return {
        ...state,
        round: createRound(newStreet, decoy),
        answer: null,
        chosenSide: null,
      }
    }
    case 'RESET': {
      return initState()
    }
    default:
      return state
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, undefined, initState)

  const guess = useCallback((side: Side) => {
    dispatch({ type: 'GUESS', side })
  }, [])

  const startRound = useCallback((location: Location) => {
    dispatch({ type: 'START_ROUND', location })
  }, [])

  const retry = useCallback(() => {
    dispatch({ type: 'RETRY' })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return { state, guess, startRound, retry, reset }
}
