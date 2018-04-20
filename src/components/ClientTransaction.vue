<template>
  <panel title="Transaction">
    <transaction :user="$store.state.user"></transaction>
  </panel>
</template>

<script>
  import Transaction from '@/components/shared/Transaction'

  export default {
    name: 'ClientTransaction',
    components: {Transaction}
  }
</script>

<style scoped>

</style>
