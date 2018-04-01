<template>
  <panel :title="$t('login:title')" small="true">
    <v-alert v-if="error" icon="priority_high" value="true" color="error">
      {{$t('login:wrongPasswordOrUser')}}
    </v-alert>
    <v-form name="login" ref="form">
      <v-text-field
        name="email"
        :label="$t('login:email')"
        required
        :rules="[rules.required]"
        v-model="email"
      ></v-text-field>
      <br>
      <v-text-field
        name="password"
        :label="$t('login:password')"
        type="password"
        required
        :rules="[rules.required]"
        v-model="password"
      ></v-text-field>
      <router-link to="/forgot-password" color="accent">
        {{$t('login:forgotPassword')}}
      </router-link>
    </v-form>
    <v-btn
      @click="login" color="secondary">
      {{$t('login:connect')}}
    </v-btn>
  </panel>
</template>

<script>
  import Rules from '@/rules'
  import AuthenticationService from '@/service/AuthenticationService'
  import i18next from 'i18next'

  export default {
    data () {
      i18next.addResources('en', 'login', {
        title: 'Connection',
        email: 'email',
        password: 'password',
        connect: 'Login',
        forgotPassword: 'Forgot Password',
        wrongPasswordOrUser: 'Wrong email or password'
      })
      i18next.addResources('fr', 'login', {
        title: 'Connexion',
        email: 'courriel',
        password: 'mot de passe',
        connect: 'Se connecter',
        forgotPassword: 'Mot de passe oublié',
        wrongPasswordOrUser: 'Mauvais courriel ou mot de passe'
      })
      return {
        email: '',
        password: '',
        error: null,
        rules: Rules
      }
    },
    name: 'Login',
    methods: {
      login: function () {
        if (!this.$refs.form.validate()) {
          return
        }
        return AuthenticationService.login({
          email: this.email,
          password: this.password
        }).then(function (response) {
          this.$store.dispatch('setToken', response.data.token)
          this.$store.dispatch('setUser', response.data.user)
          this.$router.push({
            name: this.$store.state.baseComponent
          })
        }.bind(this)).catch(function (error) {
          this.error = error.response.data.error
        }.bind(this))
      }
    }
  }
</script>

<style scoped>

</style>
