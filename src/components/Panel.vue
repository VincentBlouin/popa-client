<template>
  <v-container fluid class='panel pt-2 pb2' :class="{
                'pl-2 pr-2': $vuetify.breakpoint.mdAndUp,
                'pl-0 pr-0': $vuetify.breakpoint.smAndDown
            }">
    <v-slide-y-transition mode="out-in">
      <v-layout row align-center justify-center>
        <v-flex :md8="small" :md12="!small" xs12>
          <div class="white elevation-2">
            <v-toolbar flat dense color="secondary" dark>
              <v-toolbar-title>
                {{title}}
              </v-toolbar-title>
            </v-toolbar>
            <div class="pt-2 pb-2 pl-2 pr-2"
            >
              <slot>
                {{noContent || $t('noContent')}}
              </slot>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
  export default {
    name: 'panel',
    props: [
      'title',
      'noContent',
      'small'
    ]
  }
</script>

<style scoped>

</style>
