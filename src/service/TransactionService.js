import Service from '@/service/service'

export default {
  list: function (user) {
    return Service.api().get(user.id + '/transaction')
  },
  getDetails: function (user, transaction) {
    return Service.api().get(user.id + '/transaction/' + transaction.id)
  },
  addForUser: function (items, user) {
    return Service.api().post(
      user.id + '/transaction',
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
