<template>
  <div class="someday">
    <div class="title">Someday</div>
    <List
      :items="listOfItems"
    />
  </div>
</template>

<script>
import List from './List.vue'

export default {
  name: 'Someday',
  data () {
    return {
      listOfItems: [{
        name: "Some test name"
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
