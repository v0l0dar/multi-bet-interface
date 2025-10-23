import { axiosApi } from './axios-api-config'
import type { Game, Bet } from '@/types/game'

export const fetchGames = () => axiosApi.get<Game[]>('/games')
export const submitBet = (bet: Bet) => axiosApi.post('/bets', bet)
