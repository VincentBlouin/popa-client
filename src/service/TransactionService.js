import Service from '@/service/service'

export default {
  list: function (user) {
    return Service.api().get('/subscriber/' + user.id)
  },
  addForUser: function (user, items) {
    return Service.api().post(
      '/subscriber/' + user.id,
      items
    )
  }
}
