# Geo Game

An interactive geography guessing game. Players are shown Google Street View imagery from two different locations and must guess which side displays the specified city. Features 210+ cities across the globe with proximity-based decoy selection — the "wrong" street view is always from a nearby region, keeping the game challenging.

## Setup

Requires a [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key) with Street View enabled.

```sh
cp .env.example .env
# Add your Google Maps API key to .env
```

## Development

```sh
bun install
bun run dev
```

## Build

```sh
bun run build
bun run preview
```

## Tech Stack

- React 19 + TypeScript
- TanStack Start / Router
- Tailwind CSS v4
- Vite
- Google Maps Street View API
