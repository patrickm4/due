<template>
  <div class="list">
    <div
      v-for="u in items"
      :key="u.name"
      class="list-item"
    >
      <div>{{ u.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'List',
  props: {
    items: Array,
    default: []
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
