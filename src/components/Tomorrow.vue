<template>
  <div class="tomorrow">
    <div class="title">Tomorrow</div>
    <List
      :items="listOfItems"
    />
  </div>
</template>

<script>
import List from './List.vue'

export default {
  name: 'Tomorrow',
  data () {
    return {
      listOfItems: [{
        name: "Tom test name"
      }]
    }
  },
  components: {
    List
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
