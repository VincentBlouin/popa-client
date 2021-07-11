import axios from 'axios'
import Store from '@/store'
import RequestErrors from '@/requestError'

const Service = {
  baseUrl: function () {
    let apiPort = window.location.protocol.indexOf('https') > -1 ? '443' : '3500'
    return location.protocol + '//' + location.hostname + ':' + apiPort + '/api'
  },
  api: function () {
    const loginPages = [
      '/',
      '/login'
    ]
    const axiosInstance = axios.create({
      baseURL: Service.baseUrl(),
      headers: {
        Authorization: 'Bearer ' + Store.state.token
      }
    })
    axiosInstance.interceptors.response.use(null, function (error) {
      if (error.response && error.response.status === 401) {
        Store.dispatch('setToken', null)
        Store.dispatch('setUser', null)
        if (loginPages.indexOf(window.location.pathname) === -1) {
          window.location.href = '/'
        }
      }
      if (!error.response || [403, 401].indexOf(error.response.status) === -1) {
        RequestErrors.addRequestError(error)
      }
      return Promise.reject(error)
    })
    return axiosInstance
  }
}
export default Service
