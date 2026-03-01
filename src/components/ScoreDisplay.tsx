interface ScoreDisplayProps {
  correct: number
  incorrect: number
}

export function ScoreDisplay({ correct, incorrect }: ScoreDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-8 bg-gray-800 py-2 px-4">
      <span className="text-green-400 font-semibold">
        Correct: {correct}
      </span>
      <span className="text-gray-500">|</span>
      <span className="text-red-400 font-semibold">
        Incorrect: {incorrect}
      </span>
    </div>
  )
}
