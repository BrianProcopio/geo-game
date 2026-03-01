interface ResultOverlayProps {
  result: 'correct' | 'incorrect'
  cityName?: string
  country?: string
}

export function ResultOverlay({ result, cityName, country }: ResultOverlayProps) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 ${
        result === 'correct' ? 'bg-green-500/40' : 'bg-red-500/40'
      }`}
    >
      <span className="text-white text-2xl sm:text-4xl font-bold drop-shadow-lg">
        {result === 'correct' ? 'Correct!' : 'Wrong!'}
      </span>
      {result === 'incorrect' && cityName && country && (
        <span className="text-white text-base sm:text-xl font-semibold drop-shadow-lg mt-2">
          This was {cityName}, {country}
        </span>
      )}
    </div>
  )
}
