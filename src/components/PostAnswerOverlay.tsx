import type { Location } from '~/data/locations'
import type { Side } from '~/lib/game-logic'

interface PostAnswerOverlayProps {
  result: 'correct' | 'incorrect'
  correctLocation: Location
  chosenSide: Side
  onSelectNew: () => void
  onRetry: () => void
}

export function PostAnswerOverlay({
  result,
  correctLocation,
  onSelectNew,
  onRetry,
}: PostAnswerOverlayProps) {
  const isCorrect = result === 'correct'

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60">
      <div className="flex flex-col items-center gap-4 sm:gap-6 p-5 sm:p-8 rounded-2xl bg-gray-900/90 shadow-2xl max-w-[90vw]">
        <div
          className={`text-2xl sm:text-4xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}
        >
          {isCorrect ? 'Correct!' : 'Wrong!'}
        </div>
        <div className="text-gray-300 text-base sm:text-lg">
          {correctLocation.city}, {correctLocation.country}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer text-sm sm:text-base"
          >
            Retry Same Location
          </button>
          <button
            onClick={onSelectNew}
            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer text-sm sm:text-base"
          >
            Select New Location
          </button>
        </div>
      </div>
    </div>
  )
}
