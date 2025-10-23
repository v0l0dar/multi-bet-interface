import axios from 'axios'

export const axiosApi = axios.create({
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: 'https://dog.ceo/api',
})
