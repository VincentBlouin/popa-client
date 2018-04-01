import axios from 'axios'
import Store from '@/store'

export default {
  api: function () {
    const loginPages = [
      '/',
      '/login'
    ]
    const axiosInstance = axios.create({
      baseURL: location.protocol + '//' + location.hostname + ':3000',
      headers: {
        Authorization: 'Bearer ' + Store.state.token
      }
    })
    axiosInstance.interceptors.response.use(null, function (error) {
      if (error.response.status === 401) {
        Store.dispatch('setToken', null)
        Store.dispatch('setUser', null)
        if (loginPages.indexOf(window.location.pathname) === -1) {
          window.location.href = '/'
        }
      }
      return Promise.reject(error)
    })
    return axiosInstance
  }
}
