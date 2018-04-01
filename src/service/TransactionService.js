import Service from '@/service/service'

export default {
  list: function (user) {
    return Service.api().get('/subscriber/' + user.id)
  },
  addForUser: function (items, user) {
    return Service.api().post(
      '/subscriber/' + user.id,
      items
    )
  },
  addForAnonymous: function (items) {
    return Service.api().post(
      '/subscriber/',
      items
    )
  }
}
