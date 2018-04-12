import Service from '@/service/service'

export default {
  clients: function () {
    return Service.api().get('/clients')
  },
  getDetails: function (user) {
    return Service.api().get('/clients/' + user.id)
  },
  updateClient: function (client) {
    return Service.api().put('/clients', client)
  },
  createClient: function (client) {
    return Service.api().post('/clients', client)
  }
}

// import Service from '@/service/service'
// export default {
//   // register: function (user) {
//   //   return Service.api().post("/register", user);
//   // },
//   login: function (user) {
//     return Service.api().post('/login', user)
//   },
//   resetPassword: function (user) {
//     return Service.api().post('/reset-password', user)
//   },
//   isChangePasswordTokenValid: function (token) {
//     return Service.api().post('/token-valid', token)
//   },
//   changePassword: function (passwordAndToken) {
//     return Service.api().post('/change-password', passwordAndToken)
//   },
//   emailExists: function (email) {
//     return Service.api().post('/email-exists', {email: email})
//   }
// }
