import { apiAgent } from '@/plugins/axiosConfig'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

const useHttp = () => {
  
  const onSuccess = <T>(response: AxiosResponse<T>) => response.data
  const onError = (error: any) => {
    console.error('Request Failed:', error)
    return Promise.reject(error.response || error.message)
  }

  const getApi = async <T = any>(path: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await apiAgent.get<T>(path, config)
      return onSuccess(response)
    } catch (error) {
      return onError(error)
    }
  }

  const postApi = async <T = any>(
    path: string,
    data?: AxiosRequestConfig['data'],
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await apiAgent.post<T>(path, data, { ...config, params })
      return onSuccess(response)
    } catch (error) {
      return onError(error)
    }
  }

  const putApi = async <T = any>(path: string, data?: any, params?: any): Promise<T> => {
    try {
      const response = await apiAgent.put(path, data, { params })
      return onSuccess(response)
    } catch (error) {
      return onError(error)
    }
  }

  const deleteApi = async <T = any>(
    path: string,
    params?: AxiosRequestConfig['params']
  ): Promise<T> => {
    try {
      const response = await apiAgent.delete(path, { params })
      return onSuccess(response)
    } catch (error) {
      return onError(error)
    }
  }
  return {
    getApi,
    putApi,
    postApi,
    deleteApi
  }
}

export default useHttp
