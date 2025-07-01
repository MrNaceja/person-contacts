import axios, { AxiosError } from 'axios'
import { AuthService } from './auth';

const BACKEND_URL = 'http://127.0.0.1:3000'

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

api.interceptors.request.use((config) => {
  const isPublic = ['/auth/sign-in', '/auth/sign-up'].some((url) =>
    config.url?.includes(url)
  );

  if (!isPublic) {
    const authToken = AuthService.catchToken()
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`
    }
  }
  return config
})

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => Promise.reject({
    message: (error.response?.data as ApiPersonContactsError).message || error.message,
    status: error.status
  })
)