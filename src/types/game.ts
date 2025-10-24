export interface Odds {
  homeWin: number
  draw?: number
  awayWin: number
}

export interface Game {
  id: string
  sport: string
  homeTeam: string
  awayTeam: string
  startTime: string
  odds: Odds
  status: 'upcoming' | 'live' | 'finished'
}

export type BetType = 'homeWin' | 'draw' | 'awayWin'

export interface Selection {
  gameId: string
  betType: BetType
  odds: number
  stake: number
  potentialPayout: number
}

export interface Bet {
  selections: Selection[]
  totalStake: number
  totalPotentialPayout: number
  acceptedTerms: boolean
  timestamp: string
}
