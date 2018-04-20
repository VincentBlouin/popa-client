<template>
  <panel :title="$t('subscribe:title')" v-if="loaded">
    {{$t('subscribe:contact')}}
    <a href="mailto:potagerspartages@gmail.com">
      potagerspartages@gmail.com
    </a>
  </panel>
</template>

<script>
  import i18n from '@/i18n'

  export default {
    name: 'subscribe',
    data () {
      i18n.i18next.addResources('en', 'subscribe', {
        title: 'Subscribe',
        contact: 'Contact'
      })
      i18n.i18next.addResources('fr', 'subscribe', {
        title: 'S\'abonner',
        contact: 'Contactez'
      })
      return {
        loaded: false
      }
    },
    mounted: function () {
      this.loaded = true
    }
  }
</script>

<style scoped>

</style>
