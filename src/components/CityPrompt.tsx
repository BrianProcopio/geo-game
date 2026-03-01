interface CityPromptProps {
  city: string
  country: string
}

export function CityPrompt({ city, country }: CityPromptProps) {
  return (
    <div className="flex items-center justify-center bg-gray-800 py-3 px-4">
      <h1 className="text-2xl font-bold tracking-wide">
        {city}, {country}
      </h1>
    </div>
  )
}
