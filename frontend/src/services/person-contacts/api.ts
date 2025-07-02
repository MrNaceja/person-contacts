import axios, { AxiosError } from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:3000'

export type ApiPersonContactsError = {
  message: string,
  status: number
}

export const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => Promise.reject({
    message: (error.response?.data as ApiPersonContactsError).message || error.message,
    status: error.status
  })
)