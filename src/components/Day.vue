<template>
    <div class="page-day">
      <template v-if="!isCreating">
        <h1>{{ dayName }}</h1>
        <div 
            v-if="todos && todos.length"
            class="todos-container"
        >
            <div 
              v-for="(todo, index) in todos"
              :key="index"
            >
              <input type="checkbox" :checked="todo.checked"/>
                {{ todo.task }}
            </div>
        </div>
        <div v-else class="todos-container">
            What to do {{ dayName.toLowerCase() }}...
        </div>
        <div class="add-todo-btn">
          <span class="add-font" @click="openCreate">+</span>
        </div>
      </template>
      <template v-else>
        <div class="close-create-todo-btn" @click="isCreating = false">Close</div>
        <div class="create-todo-input-box">
          Due {{ dayName }}
          <input type="text" v-model="newTodo" class="create-todo-input" @keyup.enter="createTodo" :ref="`create-todo-${dayName.toLowerCase()}`"/>
        </div>
      </template>
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
    // get localstorage and set here?

    return {
      list: [],
      isCreating: false,
      newTodo: ''
    }
  },
  computed: {
    todos () {
      const filteredByDay = this.list.filter(t => t.day === this.dayName.toLowerCase())
      return [...this.items, ...filteredByDay]
    }
  },
  methods: {
    createTodo () {
      //TODO save to locaStorage
      this.list.push({
        task: this.newTodo,
        checked: false,
        day: this.dayName.toLowerCase()
      })
      this.newTodo = ''
      this.isCreating = false
    },
    openCreate () {
      this.isCreating = true
      this.$nextTick(() => {
        this.$refs[`create-todo-${this.dayName.toLowerCase()}`].focus()
      })
    }
  }
}
</script>

<style>
  .close-create-todo-btn {
    margin: 1rem;
  }
  .create-todo-input {
    border: none;
    border-bottom: 2px solid #000;
    border-left: 2px solid #000;
    border-right: 2px solid #000;
  }
  .create-todo-input-box {
    display: flex;
    align-items: center;
    flex-direction: column;  
  }
  .todos-container {
      margin-left: 1.5rem;
  }
  .add-font {
    font-size:36pt;
  }
  .add-todo-btn {
    position: absolute;
    bottom:5%;
    display: flex;
    justify-content: center;
    width:100%;
  }
</style>