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
        :rules="[rules.required, rules.email]"
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
      <router-link to="/send-change-password-email" color="accent">
        {{$t('login:forgotPassword')}}
      </router-link>
    </v-form>
    <v-btn
      @click="login" color="secondary">
      {{$t('login:connect')}}
    </v-btn>
    <v-card>
      <v-card-text class="text-xs-center">
        <p class="subheading">
          {{$t('login:loginIntro1')}}
          <a href="mailto:potagerspartages@gmail.com">
            potagerspartages@gmail.com
          </a>
          {{$t('login:loginIntro2')}}
        </p>
        <p class="subheading">
          {{$t('login:loginIntro21')}}
          <router-link to="send-change-password-email">
            {{$t('login:loginIntro3')}}
          </router-link>
          {{$t('login:loginIntro4')}}
        </p>
      </v-card-text>
    </v-card>
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
        forgotPassword: 'Change password',
        wrongPasswordOrUser: 'Wrong email or password',
        loginIntro1: 'Contact',
        loginIntro2: 'to register',
        loginIntro21: 'Once registered,',
        loginIntro3: 'change your password',
        loginIntro4: 'before you login for the first time'
      })
      i18next.addResources('fr', 'login', {
        title: 'Connexion',
        email: 'courriel',
        password: 'mot de passe',
        connect: 'Se connecter',
        forgotPassword: 'Modifier votre mot de passe',
        wrongPasswordOrUser: 'Mauvais courriel ou mot de passe',
        loginIntro1: 'Contactez',
        loginIntro2: 'pour vous inscrire',
        loginIntro21: 'Une fois inscrit, ',
        loginIntro3: 'modifiez votre mot de passe',
        loginIntro4: 'avant de vous connecter pour la première fois'
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
