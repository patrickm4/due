<template>
    <div class="page-day">
        <h1>{{ dayName }}</h1>
        <div 
            v-if="todos && todos.length"
            class="todos-container"
        >
            <div 
                v-for="(todo, index) in todos"
                :key="index"
            >
                {{ todo.name }}
            </div>
        </div>
        <div v-else class="todos-container">
            What to do {{ dayName.toLowerCase() }}...
        </div>
    </div>
</template>

<script>
export default {
  name: 'Day',
  props: {
    items: {
        type: Array,
        default: function () {
            return []
        }
    },
    dayName: {
        type: String,
        default: ''
    }
  },
  data () {
    return {
    }
  },
  computed: {
    todos () {
      return this.items
    }
  },
  methods: {
    createTodo () {
      //save to locaStorage as the day
    }
  }
}
</script>

<style>
    .todos-container {
        margin-left: 1.5rem;
    }
</style>