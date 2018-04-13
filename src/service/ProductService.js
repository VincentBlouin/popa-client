import Service from '@/service/service'

export default {
  listAvailable: function () {
    return Service.api().get('/available-product')
  },
  listAll: function () {
    return Service.api().get('/product')
  },
  getDetails: function (product) {
    return Service.api().get('/product/' + product.id)
  },
  update: function (product) {
    return Service.api().put('/product', product)
  },
  create: function (product) {
    return Service.api().post('/product', product)
  }
}
