import axios from 'axios'

export const baseURL = 'http://localhost:3000/'
export const apiAgent = axios.create({ baseURL })
apiAgent.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)
apiAgent.interceptors.response.use(
  (config) => config,
  (error) => Promise.reject(error)
)
