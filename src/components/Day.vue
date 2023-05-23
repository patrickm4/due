<template>
    <div class="page-day">
      <template v-if="!isCreating">
        <h1>{{ dayName }}</h1>
        <div 
            v-if="todos && todos.length"
            class="todos-container"
        >
            <div 
              v-for="todo in todos"
              :key="todo.id"
              @click="selectedTask = todo.id"
            >
              <input type="checkbox" :checked="todo.checked" @click.stop/>
              {{ todo.task }}
              <div v-if="selectedTask === todo.id" class="task-dropdown">
                <div class="task-dropdown-left">
                  <button @click.stop="selectedTask = ''">Close</button>
                </div>
                <div class="task-dropdown-right">
                  <button 
                    v-for="otherDay in otherDays" 
                    :key="todo.id + otherDay"
                    @click="changeTaskDay(otherDay)"  
                  >Do it {{ otherDay }}</button>
                  <button @click.stop="deleteTask">Delete</button>
                </div>
              </div>
              <!-- 
                task name
                how long ago added
                btn: Mark as completed
                btn: Do it {day}
                btn: Do it {day}
                - or -
                Schedule for a day
                ----
                delete
               -->
            </div>
        </div>
        <div v-else class="todos-container">
            What to do {{ dayName.toLowerCase() }}...
        </div>
        <div class="add-todo-btn">
          <span class="add-font" @click="openCreate">+</span>
          <!-- 
            other options
            remove completed items
            about
           -->
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
import { v4 as uuidv4 } from 'uuid';

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
      list: this.items, // initialize the passed todos
      isCreating: false,
      newTodo: '',
      selectedTask: ''
    }
  },
  computed: {
    todos () {
      return this.list.filter(t => t.day === this.dayName.toLowerCase())
    },
    otherDays () {
      const allDays = ['someday', 'today', 'tomorrow']
      return allDays.filter(d => d !== this.dayName.toLowerCase())
    }
  },
  // watch
  methods: {
    changeTaskDay(day) {
      const taskIndex = this.list.findIndex(t => t.id === this.selectedTask)

      if (taskIndex !== -1) {
        this.selectedTask = ''
        
        let taskObj = this.list[taskIndex]
        taskObj.day = day
        window.localStorage.setItem('todos', JSON.stringify(this.list))
        this.$emit('reloadCache')
      }
    },
    deleteTask () {
      const taskIndex = this.list.findIndex(t => t.id === this.selectedTask)
      
      if (taskIndex !== -1) {
        this.selectedTask = ''
        this.list.splice(taskIndex, 1)
        window.localStorage.setItem('todos', JSON.stringify(this.list))
      }
    },
    createTodo () {
      this.list.push({
        id: `task-${uuidv4()}`,
        task: this.newTodo,
        checked: false,
        day: this.dayName.toLowerCase()
      })

      //TODO get the localstorage first
      // or watch this.list then get localstorage then save it back

      window.localStorage.setItem('todos', JSON.stringify(this.list))

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
  .task-dropdown-left {
    
  }
  .task-dropdown-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 1rem;
  }
  .task-dropdown-right > button {
    margin-bottom: .5rem;
  }
  .task-dropdown{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: .5rem;
  }
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