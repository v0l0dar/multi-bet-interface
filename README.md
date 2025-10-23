# Multi-Bet Interface

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

This project is a **Vue.js 3 application** designed for creating an intuitive **multi-bet selection interface**. It serves as a frontend developer interview assignment, testing your skills in:

- Vue 3 (Composition API)
- TypeScript
- Component architecture
- State management with Pinia
- Handling complex form interactions
- UI/UX design and edge cases

**Time Expectation:** 4-5 hours  
**Tech Stack:** Vue 3, TypeScript, TailwindCSS, Pinia, json-server

> Note: The focus is on functionality, decision-making, and user experience rather than perfection.

## Repository

[GitHub Repository](https://github.com/v0l0dar/multi-bet-interface.git)

---

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/v0l0dar/multi-bet-interface.git
cd multi-bet-interface
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the API Server (json-server)

```bash
npm run serve:api
```

- Runs on `http://localhost:3001`
- Simulates network delay for demonstration (`--delay 500`)

### 4. Run the Development Server

```bash
npm run dev
```

- Opens Vue app on `http://localhost:5173` (or configured port)

---

## Data Structure

The backend uses **json-server** with a `db.json` file:

```json
{
  "games": [
    /* 20+ games with sport, teams, odds, status */
  ],
  "bets": []
}
```

### Example Game Object

```ts
interface Odds {
  homeWin: number
  draw?: number
  awayWin: number
}

interface Game {
  id: string
  sport: string
  homeTeam: string
  awayTeam: string
  startTime: string // ISO 8601
  odds: Odds
  status: 'upcoming' | 'live' | 'finished'
}
```

### Example Bet Object

```ts
interface Selection {
  gameId: string
  betType: 'home' | 'draw' | 'away'
  stake: number
  odds: number
  potentialPayout: number
}

interface Bet {
  selections: Selection[]
  totalStake: number
  totalPotentialPayout: number
  acceptedTerms: boolean
  timestamp: string
}
```

---

## Features

### 1. Game Selection View

- Displays available games in an organized, scannable format
- Filters by:
  - Sport type
  - Game status: `upcoming`, `live`, `finished`

### 2. Betslip

- Users can select outcomes: **Home Win / Draw / Away Win**
- Maximum of **10 selections per bet slip**
- Live calculation of **potential payout**
- Stake input (between €1 - €1000)
- Acceptance of **terms & conditions** required

### 3. Validation

#### Client-side Validation

- Minimum 1 game selected
- Each selection must have a bet type
- Cannot bet on finished games
- Stake must be within limits
- Terms & conditions must be accepted

#### Global Validation

- Submit button disabled until valid
- Clear, contextual error messages

### 4. Form Submission

- POST `/bets` with full bet data
- Shows **loading**, **success**, and **error** states
- On success:
  - Displays bet reference number
  - Shows summary
  - Option to place another bet
- On error:
  - Shows clear error message
  - Preserves bet slip data

---

## Stores (Pinia)

### `useGamesStore`

- Loads games from API
- Handles sport & status filters
- Provides computed `filteredGames` and `uniqueSports`

### `useBetSlipStore`

- Manages selections, stake, and terms acceptance
- Handles add/remove of selections
- Computes `totalStake` and `totalPotentialPayout`
- Submits bet via API with proper loading/error handling

---

## API Service

`src/services/api.ts`:

- `fetchGames()`: GET `/games`
- `submitBet(bet: Bet)`: POST `/bets`

Configured using Axios (`src/services/axios-api-config.ts`) with `Content-Type: application/json`.

---

## UI Components

- `GameFilters.vue`: Sport & status filters
- `GameList.vue` / `GameItem.vue`: Displays games, odds, selection buttons
- `BetSlip.vue` / `BetSlipItem.vue`: Displays selected bets, stake, potential payout, and submission form

---

## Scripts

```json
"scripts": {
  "dev": "vite",
  "serve:api": "json-server --watch db.json --port 3001 --delay 500",
  "build": "vite build",
  "preview": "vite preview",
  "type-check": "vue-tsc --build",
  "lint": "eslint . --fix --cache",
  "format": "prettier --write src/"
}
```

---

## Assumptions

- Betting is not allowed for finished games
- Stake applies to each selection individually
- Maximum of 10 games per bet slip
- JSON data is sufficient for UI testing; no real API needed
- Simulated delay in `json-server` demonstrates loading states
