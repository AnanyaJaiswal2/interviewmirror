import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authService = {
  signup: (data) => API.post('/auth/signup', data),
  login:  (data) => API.post('/auth/login',  data),
  getMe:  ()     => API.get('/auth/me'),
}

export const sessionService = {
  create:       (data)     => API.post('/sessions/create', data),
  getAll:       ()         => API.get('/sessions'),
  getStats:     ()         => API.get('/sessions/stats'),
  getOne:       (id)       => API.get(`/sessions/${id}`),
  submitAnswer: (id, data) => API.post(`/sessions/${id}/answer`, data),
  complete:     (id)       => API.post(`/sessions/${id}/complete`),
}

export default API