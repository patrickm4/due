<template>  
  <vue-scroll-snap :fullscreen="true" :horizontal="true">
    <Day class="item" :items="todayTodos" day-name="Today" @reloadCache="getTasks"></Day>
    <Day class="item" :items="tomorrowTodos" day-name="Tomorrow" @reloadCache="getTasks"></Day>
    <Day class="item" :items="somedayTodos" day-name="Someday" @reloadCache="getTasks"></Day>
  </vue-scroll-snap>
</template>

<script>
import VueScrollSnap from "vue-scroll-snap";
import Day from "./components/Day.vue";

export default {
  name: 'App',
  components: {
    Day,
    VueScrollSnap
  },
  data () {
    return {
      mouseDown: false,
      startX: null,
      scrollLeft: null,
      todayTodos: [],
      tomorrowTodos: [],
      somedayTodos: []
    }
  },
  mounted () {
    this.getTasks()
  },
  methods: {
    getTasks () {
      const nonParsedTodos = window.localStorage.getItem('todos')

      if (nonParsedTodos) {
        const todos = JSON.parse(nonParsedTodos)

        let todayTs = []
        let tomorrowTs = []
        let somedayTs = []

        todos.forEach(t => {
          switch (t.day) {
            case 'today':
              todayTs.push(t)
              break
            case 'tomorrow':
              //TODO check if the date is today or in the past, push to the today array if so.
              tomorrowTs.push(t)
              break
            case 'someday':
              somedayTs.push(t)
              break;
            default:
              console.log("Error: task with no day attached")
          }
        })

        this.todayTodos = todayTs
        this.tomorrowTodos = tomorrowTs
        this.somedayTodos = somedayTs
      }

      // for someday, decrement the timing for switching the task/goal to tomorrow, then save back to localstorage
    }
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
h1 {
  margin-left: 1rem;
}
</style>
