import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, createContext, useContext, useReducer, useCallback, useRef } from "react";
const GoogleMapsContext = createContext(false);
function useGoogleMapsReady() {
  return useContext(GoogleMapsContext);
}
function useGoogleMapsLoader() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.google?.maps) {
      setReady(true);
      return;
    }
    const apiKey = "AIzaSyDWpaX0lwhrOMU58SVeWS89JU8TaraoVAE";
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=maps3d&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => setReady(true);
    script.onerror = () => console.error("Failed to load Google Maps API");
    document.head.appendChild(script);
  }, []);
  return ready;
}
const locations = [
  // Europe
  { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  { city: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
  { city: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734 },
  { city: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041 },
  { city: "Berlin", country: "Germany", lat: 52.52, lng: 13.405 },
  { city: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738 },
  { city: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378 },
  { city: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393 },
  { city: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603 },
  { city: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683 },
  { city: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686 },
  { city: "Oslo", country: "Norway", lat: 59.9139, lng: 10.7522 },
  { city: "Helsinki", country: "Finland", lat: 60.1699, lng: 24.9384 },
  { city: "Warsaw", country: "Poland", lat: 52.2297, lng: 21.0122 },
  { city: "Budapest", country: "Hungary", lat: 47.4979, lng: 19.0402 },
  { city: "Athens", country: "Greece", lat: 37.9838, lng: 23.7275 },
  { city: "Brussels", country: "Belgium", lat: 50.8503, lng: 4.3517 },
  { city: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417 },
  { city: "Edinburgh", country: "United Kingdom", lat: 55.9533, lng: -3.1883 },
  { city: "Munich", country: "Germany", lat: 48.1351, lng: 11.582 },
  { city: "Milan", country: "Italy", lat: 45.4642, lng: 9.19 },
  { city: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038 },
  { city: "Kraków", country: "Poland", lat: 50.0647, lng: 19.945 },
  { city: "Bucharest", country: "Romania", lat: 44.4268, lng: 26.1025 },
  { city: "Sofia", country: "Bulgaria", lat: 42.6977, lng: 23.3219 },
  { city: "Zagreb", country: "Croatia", lat: 45.815, lng: 15.9819 },
  { city: "Tallinn", country: "Estonia", lat: 59.437, lng: 24.7536 },
  { city: "Riga", country: "Latvia", lat: 56.9496, lng: 24.1052 },
  { city: "Vilnius", country: "Lithuania", lat: 54.6872, lng: 25.2797 },
  { city: "Ljubljana", country: "Slovenia", lat: 46.0569, lng: 14.5058 },
  { city: "Bratislava", country: "Slovakia", lat: 48.1486, lng: 17.1077 },
  { city: "Reykjavik", country: "Iceland", lat: 64.1466, lng: -21.9426 },
  { city: "Porto", country: "Portugal", lat: 41.1579, lng: -8.6291 },
  { city: "Florence", country: "Italy", lat: 43.7696, lng: 11.2558 },
  { city: "Seville", country: "Spain", lat: 37.3891, lng: -5.9845 },
  { city: "Lyon", country: "France", lat: 45.764, lng: 4.8357 },
  { city: "Hamburg", country: "Germany", lat: 53.5511, lng: 9.9937 },
  { city: "Marseille", country: "France", lat: 43.2965, lng: 5.3698 },
  { city: "Belgrade", country: "Serbia", lat: 44.7866, lng: 20.4489 },
  // Asia
  { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { city: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.978 },
  { city: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
  { city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
  { city: "Hong Kong", country: "China", lat: 22.3193, lng: 114.1694 },
  { city: "Taipei", country: "Taiwan", lat: 25.033, lng: 121.5654 },
  { city: "Kuala Lumpur", country: "Malaysia", lat: 3.139, lng: 101.6869 },
  { city: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456 },
  { city: "Manila", country: "Philippines", lat: 14.5995, lng: 120.9842 },
  { city: "Hanoi", country: "Vietnam", lat: 21.0285, lng: 105.8542 },
  { city: "Mumbai", country: "India", lat: 19.076, lng: 72.8777 },
  { city: "Delhi", country: "India", lat: 28.6139, lng: 77.209 },
  { city: "Osaka", country: "Japan", lat: 34.6937, lng: 135.5023 },
  { city: "Kyoto", country: "Japan", lat: 35.0116, lng: 135.7681 },
  { city: "Busan", country: "South Korea", lat: 35.1796, lng: 129.0756 },
  { city: "Phnom Penh", country: "Cambodia", lat: 11.5564, lng: 104.9282 },
  { city: "Colombo", country: "Sri Lanka", lat: 6.9271, lng: 79.8612 },
  { city: "Kathmandu", country: "Nepal", lat: 27.7172, lng: 85.324 },
  { city: "Doha", country: "Qatar", lat: 25.2854, lng: 51.531 },
  { city: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
  { city: "Abu Dhabi", country: "UAE", lat: 24.4539, lng: 54.3773 },
  { city: "Tel Aviv", country: "Israel", lat: 32.0853, lng: 34.7818 },
  { city: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784 },
  { city: "Ankara", country: "Turkey", lat: 39.9334, lng: 32.8597 },
  { city: "Tbilisi", country: "Georgia", lat: 41.7151, lng: 44.8271 },
  { city: "Baku", country: "Azerbaijan", lat: 40.4093, lng: 49.8671 },
  { city: "Ulaanbaatar", country: "Mongolia", lat: 47.8864, lng: 106.9057 },
  { city: "Almaty", country: "Kazakhstan", lat: 43.2551, lng: 76.9126 },
  { city: "Tashkent", country: "Uzbekistan", lat: 41.2995, lng: 69.2401 },
  { city: "Muscat", country: "Oman", lat: 23.588, lng: 58.3829 },
  // North America
  { city: "New York", country: "United States", lat: 40.7128, lng: -74.006 },
  { city: "Los Angeles", country: "United States", lat: 34.0522, lng: -118.2437 },
  { city: "Chicago", country: "United States", lat: 41.8781, lng: -87.6298 },
  { city: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194 },
  { city: "Washington DC", country: "United States", lat: 38.9072, lng: -77.0369 },
  { city: "Miami", country: "United States", lat: 25.7617, lng: -80.1918 },
  { city: "Seattle", country: "United States", lat: 47.6062, lng: -122.3321 },
  { city: "Boston", country: "United States", lat: 42.3601, lng: -71.0589 },
  { city: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832 },
  { city: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207 },
  { city: "Montreal", country: "Canada", lat: 45.5017, lng: -73.5673 },
  { city: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332 },
  { city: "Guadalajara", country: "Mexico", lat: 20.6597, lng: -103.3496 },
  { city: "Havana", country: "Cuba", lat: 23.1136, lng: -82.3666 },
  { city: "San Juan", country: "Puerto Rico", lat: 18.4655, lng: -66.1057 },
  { city: "Denver", country: "United States", lat: 39.7392, lng: -104.9903 },
  { city: "Nashville", country: "United States", lat: 36.1627, lng: -86.7816 },
  { city: "Austin", country: "United States", lat: 30.2672, lng: -97.7431 },
  { city: "New Orleans", country: "United States", lat: 29.9511, lng: -90.0715 },
  { city: "Philadelphia", country: "United States", lat: 39.9526, lng: -75.1652 },
  { city: "Portland", country: "United States", lat: 45.5155, lng: -122.6789 },
  { city: "Las Vegas", country: "United States", lat: 36.1699, lng: -115.1398 },
  { city: "Ottawa", country: "Canada", lat: 45.4215, lng: -75.6972 },
  { city: "Calgary", country: "Canada", lat: 51.0447, lng: -114.0719 },
  { city: "Quebec City", country: "Canada", lat: 46.8139, lng: -71.208 },
  // South America
  { city: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816 },
  { city: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333 },
  { city: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729 },
  { city: "Lima", country: "Peru", lat: -12.0464, lng: -77.0428 },
  { city: "Bogotá", country: "Colombia", lat: 4.711, lng: -74.0721 },
  { city: "Santiago", country: "Chile", lat: -33.4489, lng: -70.6693 },
  { city: "Montevideo", country: "Uruguay", lat: -34.9011, lng: -56.1645 },
  { city: "Quito", country: "Ecuador", lat: -0.1807, lng: -78.4678 },
  { city: "Medellín", country: "Colombia", lat: 6.2476, lng: -75.5658 },
  { city: "Cartagena", country: "Colombia", lat: 10.391, lng: -75.5144 },
  { city: "Cusco", country: "Peru", lat: -13.532, lng: -71.9675 },
  { city: "Valparaíso", country: "Chile", lat: -33.0472, lng: -71.6127 },
  { city: "La Paz", country: "Bolivia", lat: -16.4897, lng: -68.1193 },
  { city: "Asunción", country: "Paraguay", lat: -25.2637, lng: -57.5759 },
  { city: "Brasília", country: "Brazil", lat: -15.7975, lng: -47.8919 },
  { city: "Salvador", country: "Brazil", lat: -12.9714, lng: -38.5124 },
  { city: "Córdoba", country: "Argentina", lat: -31.4201, lng: -64.1888 },
  // Africa
  { city: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241 },
  { city: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473 },
  { city: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219 },
  { city: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357 },
  { city: "Marrakech", country: "Morocco", lat: 31.6295, lng: -7.9811 },
  { city: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792 },
  { city: "Accra", country: "Ghana", lat: 5.6037, lng: -0.187 },
  { city: "Dar es Salaam", country: "Tanzania", lat: -6.7924, lng: 39.2083 },
  { city: "Casablanca", country: "Morocco", lat: 33.5731, lng: -7.5898 },
  { city: "Tunis", country: "Tunisia", lat: 36.8065, lng: 10.1815 },
  { city: "Dakar", country: "Senegal", lat: 14.7167, lng: -17.4677 },
  { city: "Kampala", country: "Uganda", lat: 0.3476, lng: 32.5825 },
  { city: "Addis Ababa", country: "Ethiopia", lat: 9.0222, lng: 38.7469 },
  { city: "Durban", country: "South Africa", lat: -29.8587, lng: 31.0218 },
  { city: "Windhoek", country: "Namibia", lat: -22.5609, lng: 17.0658 },
  { city: "Maputo", country: "Mozambique", lat: -25.9692, lng: 32.5732 },
  { city: "Kigali", country: "Rwanda", lat: -1.9403, lng: 29.8739 },
  // Oceania
  { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
  { city: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631 },
  { city: "Auckland", country: "New Zealand", lat: -36.8485, lng: 174.7633 },
  { city: "Brisbane", country: "Australia", lat: -27.4698, lng: 153.0251 },
  { city: "Perth", country: "Australia", lat: -31.9505, lng: 115.8605 },
  { city: "Wellington", country: "New Zealand", lat: -41.2865, lng: 174.7762 },
  { city: "Adelaide", country: "Australia", lat: -34.9285, lng: 138.6007 },
  { city: "Christchurch", country: "New Zealand", lat: -43.532, lng: 172.6306 },
  { city: "Hobart", country: "Australia", lat: -42.8821, lng: 147.3272 },
  { city: "Gold Coast", country: "Australia", lat: -28.0167, lng: 153.4 },
  // More Europe
  { city: "Nice", country: "France", lat: 43.7102, lng: 7.262 },
  { city: "Venice", country: "Italy", lat: 45.4408, lng: 12.3155 },
  { city: "Dubrovnik", country: "Croatia", lat: 42.6507, lng: 18.0944 },
  { city: "Salzburg", country: "Austria", lat: 47.8095, lng: 13.055 },
  { city: "Bruges", country: "Belgium", lat: 51.2093, lng: 3.2247 },
  { city: "Granada", country: "Spain", lat: 37.1773, lng: -3.5986 },
  { city: "Split", country: "Croatia", lat: 43.5081, lng: 16.4402 },
  { city: "Gothenburg", country: "Sweden", lat: 57.7089, lng: 11.9746 },
  { city: "Gdańsk", country: "Poland", lat: 54.352, lng: 18.6466 },
  { city: "Cologne", country: "Germany", lat: 50.9375, lng: 6.9603 },
  // More Asia
  { city: "Chiang Mai", country: "Thailand", lat: 18.7883, lng: 98.9853 },
  { city: "Ho Chi Minh City", country: "Vietnam", lat: 10.8231, lng: 106.6297 },
  { city: "Jaipur", country: "India", lat: 26.9124, lng: 75.7873 },
  { city: "Bangalore", country: "India", lat: 12.9716, lng: 77.5946 },
  { city: "Yokohama", country: "Japan", lat: 35.4437, lng: 139.638 },
  { city: "Fukuoka", country: "Japan", lat: 33.5904, lng: 130.4017 },
  { city: "Hiroshima", country: "Japan", lat: 34.3853, lng: 132.4553 },
  { city: "Incheon", country: "South Korea", lat: 37.4563, lng: 126.7052 },
  { city: "Phuket", country: "Thailand", lat: 7.8804, lng: 98.3923 },
  { city: "George Town", country: "Malaysia", lat: 5.4141, lng: 100.3288 },
  // More Americas
  { city: "San Diego", country: "United States", lat: 32.7157, lng: -117.1611 },
  { city: "Atlanta", country: "United States", lat: 33.749, lng: -84.388 },
  { city: "Minneapolis", country: "United States", lat: 44.9778, lng: -93.265 },
  { city: "Detroit", country: "United States", lat: 42.3314, lng: -83.0458 },
  { city: "Honolulu", country: "United States", lat: 21.3069, lng: -157.8583 },
  { city: "Pittsburgh", country: "United States", lat: 40.4406, lng: -79.9959 },
  { city: "St. Louis", country: "United States", lat: 38.627, lng: -90.1994 },
  { city: "Winnipeg", country: "Canada", lat: 49.8951, lng: -97.1384 },
  { city: "Halifax", country: "Canada", lat: 44.6488, lng: -63.5752 },
  { city: "Edmonton", country: "Canada", lat: 53.5461, lng: -113.4938 },
  // Russia
  { city: "Moscow", country: "Russia", lat: 55.7558, lng: 37.6173 },
  { city: "Saint Petersburg", country: "Russia", lat: 59.9343, lng: 30.3351 },
  // Caribbean & Central America
  { city: "Panama City", country: "Panama", lat: 8.9824, lng: -79.5199 },
  { city: "San José", country: "Costa Rica", lat: 9.9281, lng: -84.0907 },
  { city: "Guatemala City", country: "Guatemala", lat: 14.6349, lng: -90.5069 },
  { city: "Santo Domingo", country: "Dominican Republic", lat: 18.4861, lng: -69.9312 },
  { city: "Kingston", country: "Jamaica", lat: 18.0179, lng: -76.8099 },
  // Additional
  { city: "Palermo", country: "Italy", lat: 38.1157, lng: 13.3615 },
  { city: "Naples", country: "Italy", lat: 40.8518, lng: 14.2681 },
  { city: "Valencia", country: "Spain", lat: 39.4699, lng: -0.3763 },
  { city: "Malmö", country: "Sweden", lat: 55.605, lng: 13.0038 },
  { city: "Antwerp", country: "Belgium", lat: 51.2194, lng: 4.4025 },
  { city: "Dresden", country: "Germany", lat: 51.0504, lng: 13.7373 },
  { city: "Leipzig", country: "Germany", lat: 51.3397, lng: 12.3731 },
  { city: "Bordeaux", country: "France", lat: 44.8378, lng: -0.5792 },
  { city: "Strasbourg", country: "France", lat: 48.5734, lng: 7.7521 }
];
function createRound(correctLocation, decoyLocation) {
  const correctSide = Math.random() < 0.5 ? "left" : "right";
  return { correctLocation, decoyLocation, correctSide };
}
function getLocationForSide(round, side) {
  return side === round.correctSide ? round.correctLocation : round.decoyLocation;
}
function isCorrectGuess(round, chosenSide) {
  return chosenSide === round.correctSide;
}
function pickRandomDecoy(exclude) {
  let decoy;
  do {
    decoy = locations[Math.floor(Math.random() * locations.length)];
  } while (decoy.city === exclude.city && decoy.country === exclude.country);
  return decoy;
}
function initState() {
  return {
    round: null,
    answer: null,
    chosenSide: null,
    selectedLocation: null
  };
}
function reducer(state, action) {
  switch (action.type) {
    case "START_ROUND": {
      const decoy = pickRandomDecoy(action.location);
      return {
        round: createRound(action.location, decoy),
        answer: null,
        chosenSide: null,
        selectedLocation: action.location
      };
    }
    case "GUESS": {
      if (!state.round || state.answer) return state;
      const correct = isCorrectGuess(state.round, action.side);
      return {
        ...state,
        answer: correct ? "correct" : "incorrect",
        chosenSide: action.side
      };
    }
    case "RETRY": {
      if (!state.selectedLocation) return state;
      const decoy = pickRandomDecoy(state.selectedLocation);
      return {
        ...state,
        round: createRound(state.selectedLocation, decoy),
        answer: null,
        chosenSide: null
      };
    }
    case "RESET": {
      return initState();
    }
    default:
      return state;
  }
}
function useGameState() {
  const [state, dispatch] = useReducer(reducer, void 0, initState);
  const guess = useCallback((side) => {
    dispatch({ type: "GUESS", side });
  }, []);
  const startRound = useCallback((location) => {
    dispatch({ type: "START_ROUND", location });
  }, []);
  const retry = useCallback(() => {
    dispatch({ type: "RETRY" });
  }, []);
  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);
  return { state, guess, startRound, retry, reset };
}
function CityPrompt({ city, country }) {
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center bg-gray-800 py-3 px-4", children: /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold tracking-wide", children: [
    city,
    ", ",
    country
  ] }) });
}
function PostAnswerOverlay({
  result,
  correctLocation,
  onSelectNew,
  onRetry
}) {
  const isCorrect = result === "correct";
  return /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-30 flex items-center justify-center bg-black/60", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-6 p-8 rounded-2xl bg-gray-900/90 shadow-2xl", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `text-4xl font-bold ${isCorrect ? "text-green-400" : "text-red-400"}`,
        children: isCorrect ? "Correct!" : "Wrong!"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "text-gray-300 text-lg", children: [
      correctLocation.city,
      ", ",
      correctLocation.country
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onRetry,
          className: "bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer",
          children: "Retry Same Location"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onSelectNew,
          className: "bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer",
          children: "Select New Location"
        }
      )
    ] })
  ] }) });
}
function ScoreDisplay({ correct, incorrect }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-8 bg-gray-800 py-2 px-4", children: [
    /* @__PURE__ */ jsxs("span", { className: "text-green-400 font-semibold", children: [
      "Correct: ",
      correct
    ] }),
    /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "|" }),
    /* @__PURE__ */ jsxs("span", { className: "text-red-400 font-semibold", children: [
      "Incorrect: ",
      incorrect
    ] })
  ] });
}
function useStreetView({ location, ready }) {
  const containerRef = useRef(null);
  const panoramaRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!ready || !location || !containerRef.current) return;
    setLoading(true);
    setError(false);
    const sv = new google.maps.StreetViewService();
    sv.getPanorama(
      {
        location: { lat: location.lat, lng: location.lng },
        radius: 500,
        source: google.maps.StreetViewSource.OUTDOOR
      },
      (data, status) => {
        if (status === google.maps.StreetViewStatus.OK && data?.location?.latLng && containerRef.current) {
          if (panoramaRef.current) {
            panoramaRef.current.setPosition(data.location.latLng);
            panoramaRef.current.setPov({
              heading: Math.random() * 360,
              pitch: 0
            });
          } else {
            panoramaRef.current = new google.maps.StreetViewPanorama(
              containerRef.current,
              {
                position: data.location.latLng,
                pov: {
                  heading: Math.random() * 360,
                  pitch: 0
                },
                scrollwheel: false,
                zoomControl: false,
                panControl: true,
                linksControl: true,
                clickToGo: true,
                addressControl: false,
                showRoadLabels: false,
                fullscreenControl: false,
                motionTrackingControl: false,
                enableCloseButton: false
              }
            );
          }
          setLoading(false);
        } else {
          setError(true);
          setLoading(false);
        }
      }
    );
  }, [location, ready]);
  return { containerRef, loading, error };
}
function ResultOverlay({ result, cityName, country }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 ${result === "correct" ? "bg-green-500/40" : "bg-red-500/40"}`,
      children: [
        /* @__PURE__ */ jsx("span", { className: "text-white text-4xl font-bold drop-shadow-lg", children: result === "correct" ? "Correct!" : "Wrong!" }),
        result === "incorrect" && cityName && country && /* @__PURE__ */ jsxs("span", { className: "text-white text-xl font-semibold drop-shadow-lg mt-2", children: [
          "This was ",
          cityName,
          ", ",
          country
        ] })
      ]
    }
  );
}
function StreetViewPanel({
  location,
  side,
  cityName,
  ready,
  onGuess,
  answer,
  chosenSide,
  bothLoaded,
  onLoaded,
  onError
}) {
  const { containerRef, loading, error } = useStreetView({ location, ready });
  useEffect(() => {
    if (!loading && !error) {
      onLoaded();
    }
  }, [loading, error, onLoaded]);
  useEffect(() => {
    if (error) {
      onError();
    }
  }, [error, onError]);
  const showOverlay = answer !== null && chosenSide === side;
  return /* @__PURE__ */ jsxs("div", { className: "relative flex-1 flex flex-col min-h-0", children: [
    /* @__PURE__ */ jsx("div", { ref: containerRef, className: "flex-1 min-h-0 bg-gray-700" }),
    loading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gray-700 z-[5]", children: /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-lg", children: "Loading Street View..." }) }),
    showOverlay && answer && /* @__PURE__ */ jsx(ResultOverlay, { result: answer, cityName: location.city, country: location.country }),
    bothLoaded && !answer && /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => onGuess(side),
        className: "absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/90 hover:bg-white text-gray-900 font-semibold py-2 px-6 rounded-lg shadow-lg transition-colors cursor-pointer",
        children: [
          "This is ",
          cityName
        ]
      }
    )
  ] });
}
function GameBoard({
  round,
  answer,
  chosenSide,
  score,
  onGuess,
  onError,
  onSelectNew,
  onRetry
}) {
  const ready = useGoogleMapsReady();
  const [panelsLoaded, setPanelsLoaded] = useState({ left: false, right: false });
  const bothLoaded = panelsLoaded.left && panelsLoaded.right;
  useEffect(() => {
    setPanelsLoaded({ left: false, right: false });
  }, [round]);
  const handleLeftLoaded = useCallback(() => {
    setPanelsLoaded((prev) => ({ ...prev, left: true }));
  }, []);
  const handleRightLoaded = useCallback(() => {
    setPanelsLoaded((prev) => ({ ...prev, right: true }));
  }, []);
  if (!ready) {
    return /* @__PURE__ */ jsx("div", { className: "h-screen flex items-center justify-center bg-gray-900", children: /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-xl", children: "Loading Google Maps..." }) });
  }
  const leftLocation = getLocationForSide(round, "left");
  const rightLocation = getLocationForSide(round, "right");
  return /* @__PURE__ */ jsxs("div", { className: "h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx(
      CityPrompt,
      {
        city: round.correctLocation.city,
        country: round.correctLocation.country
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative flex-1 flex flex-row min-h-0", children: [
      /* @__PURE__ */ jsx(
        StreetViewPanel,
        {
          location: leftLocation,
          side: "left",
          cityName: round.correctLocation.city,
          ready,
          onGuess,
          answer,
          chosenSide,
          bothLoaded,
          onLoaded: handleLeftLoaded,
          onError
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-px bg-gray-600" }),
      /* @__PURE__ */ jsx(
        StreetViewPanel,
        {
          location: rightLocation,
          side: "right",
          cityName: round.correctLocation.city,
          ready,
          onGuess,
          answer,
          chosenSide,
          bothLoaded,
          onLoaded: handleRightLoaded,
          onError
        }
      ),
      answer && chosenSide && /* @__PURE__ */ jsx(
        PostAnswerOverlay,
        {
          result: answer,
          correctLocation: round.correctLocation,
          chosenSide,
          onSelectNew,
          onRetry
        }
      )
    ] }),
    /* @__PURE__ */ jsx(ScoreDisplay, { correct: score.correct, incorrect: score.incorrect })
  ] });
}
function GlobeView({ onLocationSelected, score }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [pin, setPin] = useState(null);
  const [geocoding, setGeocoding] = useState(false);
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;
    async function init() {
      await customElements.whenDefined("gmp-map-3d");
      if (cancelled || !containerRef.current) return;
      const map3d = document.createElement("gmp-map-3d");
      map3d.setAttribute("mode", "hybrid");
      map3d.setAttribute("center", "20,0");
      map3d.setAttribute("range", "25000000");
      map3d.setAttribute("tilt", "0");
      map3d.setAttribute("heading", "0");
      map3d.style.width = "100%";
      map3d.style.height = "100%";
      containerRef.current.appendChild(map3d);
      mapRef.current = map3d;
      map3d.addEventListener("gmp-click", ((e) => {
        const clickEvent = e;
        if (!clickEvent.position) return;
        const { lat, lng } = clickEvent.position;
        handleMapClick(lat, lng);
      }));
    }
    init();
    return () => {
      cancelled = true;
      if (mapRef.current && containerRef.current) {
        containerRef.current.removeChild(mapRef.current);
        mapRef.current = null;
      }
    };
  }, []);
  const handleMapClick = useCallback(async (lat, lng) => {
    setGeocoding(true);
    setPin(null);
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({
        location: { lat, lng }
      });
      let city = "Unknown Location";
      let country = "";
      if (result.results.length > 0) {
        for (const component of result.results[0].address_components) {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1") && city === "Unknown Location") {
            city = component.long_name;
          }
          if (component.types.includes("country")) {
            country = component.long_name;
          }
        }
      }
      setPin({ lat, lng, city, country: country || "Unknown" });
    } catch {
      setPin({ lat, lng, city: "Unknown Location", country: "Unknown" });
    } finally {
      setGeocoding(false);
    }
  }, []);
  const handleConfirm = useCallback(() => {
    if (!pin) return;
    onLocationSelected({
      city: pin.city,
      country: pin.country,
      lat: pin.lat,
      lng: pin.lng
    });
  }, [pin, onLocationSelected]);
  return /* @__PURE__ */ jsxs("div", { className: "h-screen flex flex-col bg-gray-900", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-h-0", children: [
      /* @__PURE__ */ jsx("div", { ref: containerRef, className: "w-full h-full" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-gray-900/80 text-white py-2 px-6 rounded-lg text-lg font-medium pointer-events-none", children: "Click anywhere on the globe to drop a pin" }),
      geocoding && /* @__PURE__ */ jsx("div", { className: "absolute top-16 left-1/2 -translate-x-1/2 z-10 bg-gray-800/90 text-gray-300 py-2 px-4 rounded-lg", children: "Finding location..." }),
      pin && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 bg-gray-900/90 p-4 rounded-xl shadow-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-white text-lg font-semibold", children: [
          pin.city,
          pin.country ? `, ${pin.country}` : ""
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleConfirm,
            className: "bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-8 rounded-lg transition-colors cursor-pointer",
            children: "Play Here"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(ScoreDisplay, { correct: score.correct, incorrect: score.incorrect })
  ] });
}
function Home() {
  const ready = useGoogleMapsLoader();
  const {
    state,
    guess,
    startRound,
    retry,
    reset
  } = useGameState();
  const [phase, setPhase] = useState("globe");
  const [score, setScore] = useState({
    correct: 0,
    incorrect: 0
  });
  const prevAnswer = useRef(state.answer);
  useEffect(() => {
    if (state.answer && !prevAnswer.current) {
      setScore((s) => ({
        correct: s.correct + (state.answer === "correct" ? 1 : 0),
        incorrect: s.incorrect + (state.answer === "incorrect" ? 1 : 0)
      }));
    }
    prevAnswer.current = state.answer;
  }, [state.answer]);
  const handleLocationSelected = useCallback((location) => {
    startRound(location);
    setPhase("playing");
  }, [startRound]);
  const handleSelectNew = useCallback(() => {
    reset();
    setPhase("globe");
  }, [reset]);
  const handleRetry = useCallback(() => {
    retry();
  }, [retry]);
  const handleError = useCallback(() => {
    reset();
    setPhase("globe");
  }, [reset]);
  return /* @__PURE__ */ jsxs(GoogleMapsContext.Provider, { value: ready, children: [
    phase === "globe" && /* @__PURE__ */ jsx(GlobeView, { onLocationSelected: handleLocationSelected, score }),
    phase === "playing" && state.round && /* @__PURE__ */ jsx(GameBoard, { round: state.round, answer: state.answer, chosenSide: state.chosenSide, score, onGuess: guess, onError: handleError, onSelectNew: handleSelectNew, onRetry: handleRetry })
  ] });
}
export {
  Home as component
};
