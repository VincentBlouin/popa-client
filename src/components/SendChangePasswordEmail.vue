<template>
  <panel :title="$t('forgotP:title')" :small="true">
    <v-alert color="success" icon="check_circle" value="true" v-if="emailSent">
      {{$t('forgotP:sent')}}
    </v-alert>
    <div>
      <v-text-field
        name="email"
        :label="$t('forgotP:email')"
        required
        type="email"
        :rules="[rules.required, rules.email]"
        v-model="email"
      ></v-text-field>
    </div>
    <v-alert v-if="error" icon="priority_high" value="true" color="error" class="error">
      <span v-html="error"></span>
    </v-alert>
    <v-btn
      @click="send"
      dark
      class="indigo">
      {{$t('forgotP:send')}}
    </v-btn>
  </panel>
</template>

<script>
  import i18n from '@/i18n'
  import Rules from '@/rules'
  import AuthenticationService from '@/service/AuthenticationService'

  export default {
    name: 'SendChangePasswordEmail',
    data: function () {
      i18n.i18next.addResources('en', 'forgotP', {
        title: 'Send change password email',
        email: 'email',
        send: 'Send',
        sent: 'Check your email inbox for a link to change your password'
      })
      i18n.i18next.addResources('fr', 'forgotP', {
        title: 'Envoi du courriel pour modifier son mot de passe',
        email: 'courriel',
        send: 'Envoyer',
        sent: 'Vérifiez votre boîte courriel pour un lien pour modifier votre mot de passe'
      })
      return {
        email: '',
        emailSent: false,
        error: null,
        rules: Rules
      }
    },
    methods: {
      send: function () {
        if (this.email.trim() === '') {
          return
        }
        return AuthenticationService.resetPassword({
          email: this.email,
          locale: this.$store.state.locale
        }).then(function () {
          this.emailSent = true
        }.bind(this)).catch(function (error) {
          this.error = error.response.data.error
        }.bind(this))
      }
    },
    mounted: function () {
      if (this.$store.state.isUserLoggedIn) {
        this.$router.push({
          name: this.$store.state.baseComponent
        })
      }
    }
  }
</script>
