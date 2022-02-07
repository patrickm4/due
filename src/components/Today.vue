<template>
  <div class="today">
    <div class="title">Today</div>
    <List
      :items="listOfItems"
    />
  </div>
</template>

<script>
import List from './List.vue'

export default {
  name: 'today',
  data () {
    return {
      listOfItems: [{
        name: "test name"
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
