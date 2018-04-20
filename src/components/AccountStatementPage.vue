<template>
  <panel :title="title">
    <account-statement :ardoiseUser="$store.state.user"></account-statement>
  </panel>
</template>

<script>
  import i18n from '@/i18n'
  import AccountStatement from '@/components/shared/AccountStatement'

  export default {
    name: 'Account',
    components: {AccountStatement},
    data () {
      i18n.i18next.addResources('en', 'account', {
        title: 'Account statement'
      })
      i18n.i18next.addResources('fr', 'account', {
        title: 'Relevé de compte'
      })
      return {}
    },
    computed: {
      title: function () {
        return this.$store.state.user.firstName + ' ' + this.$store.state.user.lastName
      }
    }
  }
</script>

<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
