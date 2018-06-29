import Service from '@/service/service'

export default {
  list: function (user) {
    return Service.api().get(user.id + '/transaction')
  },
  listAllDetails: function () {
    return Service.api().get('/transactions/details')
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
  },
  addFundToSubscriber: function (amount, subscriber) {
    return Service.api().post(
      '/transaction/fund',
      {
        amount: amount,
        subscriberId: subscriber.id
      }
    )
  },
  addPenaltyToSubscriber: function (amount, subscriber) {
    return Service.api().post(
      '/transaction/penalty',
      {
        amount: amount,
        subscriberId: subscriber.id
      }
    )
  }
}
