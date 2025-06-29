import * as axiosLib from 'axios'

const BACKEND_URL = 'http://127.0.0.1:3000'
const TEMP_MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc2Mzc4M2JhLTA5NDUtNGE2Mi1hMTZkLTY0ZjY0NzZkY2VlZCIsImVtYWlsIjoidGVzdGVAZW1haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkaTVzdnE4LlVCSHYyT2Q1dWNEY1NELkZTcEZtL3B0Q2NhL09KcWxNbWRKS2FYb2NSMy9TQlMiLCJpYXQiOjE3NTExNTExNTksImV4cCI6MTc1MTIzNzU1OX0.g92M-hxNelbSCGyKRRutep7s36g4VYFJzlKj0HELDyY'

export const axios = axiosLib.default.create({
  baseURL: BACKEND_URL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TEMP_MOCK_TOKEN}`
  }
});