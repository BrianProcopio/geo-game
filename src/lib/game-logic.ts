import type { Location } from '~/data/locations'

export type Side = 'left' | 'right'

export interface Round {
  correctLocation: Location
  decoyLocation: Location
  correctSide: Side
}

export function createRound(
  correctLocation: Location,
  decoyLocation: Location,
): Round {
  const correctSide: Side = Math.random() < 0.5 ? 'left' : 'right'
  return {
    correctLocation: { ...correctLocation },
    decoyLocation,
    correctSide,
  }
}

export function getLocationForSide(round: Round, side: Side): Location {
  return side === round.correctSide
    ? round.correctLocation
    : round.decoyLocation
}

export function isCorrectGuess(round: Round, chosenSide: Side): boolean {
  return chosenSide === round.correctSide
}
