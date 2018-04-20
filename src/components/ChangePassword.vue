<template>
  <panel :title="$t('changePassword:title')" :noContent="$t('changePassword:checkingToken')" :small="true">
    <v-alert color="success" class="success" icon="check_circle" value="true" v-if="passwordChanged">
      {{$t('changePassword:passwordChanged')}}
      <router-link to="/login">
        {{$t('changePassword:goToLogin')}}
      </router-link>
    </v-alert>
    <div icon="info" v-if="invalidToken">
      {{$t('changePassword:invalidToken')}}
      <router-link to="/forgot-password">
        {{$t('changePassword:askForAnotherLink')}}
      </router-link>
    </div>
    <v-alert v-if="error" icon="priority_high" value="true" color="error">
      <span v-html="error"></span>
    </v-alert>
    <div v-if="validToken">
      <v-form name="login" ref="form">
        <v-text-field
          name="newPassword"
          :label="$t('changePassword:newPassword')"
          required
          type="password"
          :rules="[rules.required, rules.min8]"
          v-model="newPassword"
        ></v-text-field>
      </v-form>
      <v-alert v-if="error" icon="priority_high" value="true" color="error" class="error">
        <span v-html="error"></span>
      </v-alert>
      <v-btn
        @click="change"
        dark
        class="indigo">
        {{$t('changePassword:change')}}
      </v-btn>
    </div>
  </panel>
</template>

<script>
  import i18n from '@/i18n'
  import Rules from '@/rules'
  import Vue from 'vue'
  import AuthenticationService from '@/service/AuthenticationService'

  export default {
    name: 'ChangePassword',
    data: function () {
      i18n.i18next.addResources('en', 'changePassword', {
        title: 'Change Password',
        newPassword: 'new password',
        change: 'Change',
        checkingToken: 'Validation in progress, please wait ...',
        invalidToken: 'The link used to change your password is expired.',
        askForAnotherLink: 'Ask for another link.',
        atLeast8Chars: 'at least 8 characters',
        passwordChanged: 'Your password was changed',
        goToLogin: 'Login now'
      })
      i18n.i18next.addResources('fr', 'changePassword', {
        title: 'Modifier votre mot de passe',
        newPassword: 'nouveau mot de passe',
        change: 'Modifier',
        checkingToken: 'Validation en cours, veuillez patienter ...',
        invalidToken: 'Le lien utilisé pour modifier votre mot de passe est expiré.',
        askForAnotherLink: 'Demander un autre lien.',
        atLeast8Chars: 'au moins 8 caractères',
        passwordChanged: 'Votre mot de passe a été modifié',
        goToLogin: 'Connectez vous maintenant'
      })
      const rules = Rules
      rules.min8 = function (value) {
        return value.length >= 8 || Vue.t('changePassword:atLeast8Chars')
      }
      return {
        newPassword: '',
        rules: rules,
        passwordChanged: false,
        validToken: false,
        invalidToken: false,
        error: ''
      }
    },
    methods: {
      change: function () {
        if (!this.$refs.form.validate()) {
          return
        }
        return AuthenticationService.changePassword({
          token: this.$route.params.token,
          newPassword: this.newPassword
        }).then(function () {
          this.passwordChanged = true
        }.bind(this)).catch(function (error) {
          this.error = error.response.data.error
        }.bind(this))
      }
    },
    mounted: function () {
      AuthenticationService.isChangePasswordTokenValid({
        token: this.$route.params.token
      }).then(function () {
        this.validToken = true
      }.bind(this)).catch(function (response) {
        if (response.request.status === 403) {
          this.invalidToken = true
        } else {
          this.error = response.response.data.error
        }
      }.bind(this))
      if (this.$store.state.isUserLoggedIn) {
        this.$router.push({
          name: this.$store.state.baseComponent
        })
      }
    }
  }
</script>
