<template>
  <div class="today">
    <div class="title">Today</div>
    <List
      :items="listOfItems"
      @addTodo="addTodo"
    />
  </div>
</template>

<script>
import List from './List.vue'

export default {
  name: 'today',
  data () {
    return {
      listOfItems: []
    }
  },
  components: {
    List
  },
  methods: {
    addTodo (e) {
      console.log("yeeet", e)
      // this.listOfItems.push
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
