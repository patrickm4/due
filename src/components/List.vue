<template>
  <div class="list">
    <div v-if="todos.length > 0">
      <div
        v-for="u in items"
        :key="u.name"
        class="list-item"
      >
        <div>{{ u.name }}</div>
      </div>
    </div>
    <div>
      <div v-if="makingTodo">
        <input type="text" placeholder="What to do..." v-model="newTodo" />
        <span @click="createTodo" class="clickable">O</span>
        <span @click="makingTodo = false" class="clickable">X</span>
      </div>
      <div
        v-else
        class="clickable"
        @click="makingTodo = true"
      >
        What to do...
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'List',
  props: {
    items: Array,
    default: []
  },
  data () {
    return {
      makingTodo: false,
      newTodo: ''
    }
  },
  computed: {
    todos () {
      return this.items.length > 0 ? this.items : [{ name: 'What to do...' }]
    }
  },
  methods: {
    createTodo () {
      //emit
      this.$emit('addTodo')
      this.newTodo = false
      this.makingTodo = false
    }
  }
}
</script>

<style scoped>

</style>
