import axios from 'axios'

export const axiosApi = axios.create({
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: 'http://localhost:3001',
})
