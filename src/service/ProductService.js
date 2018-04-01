import Service from '@/service/service'

export default {
  list: function () {
    return Service.api().get('/product')
  }
}
