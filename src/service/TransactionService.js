import Service from '@/service/service'

export default {
  list: function (user) {
    return Service.api().get('/transaction/' + user.id)
  },
  addForUser: function (items, user) {
    return Service.api().post(
      '/transaction/' + user.id,
      items
    )
  },
  addForAnonymous: function (items) {
    return Service.api().post(
      '/transaction',
      items
    )
  }
}
