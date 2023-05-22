<template>  
  <vue-scroll-snap :fullscreen="true" :horizontal="true">
    <Day class="item" :items="todayTodos" day-name="Today"></Day>
    <Day class="item" :items="tomorrowTodos" day-name="Tomorrow"></Day>
    <Day class="item" :items="somedayTodos" day-name="Someday"></Day>
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
    // get localStorage todos
    // todays, tomorrows and somedays
    // then pass to components

    const nonParsedTodos = window.localStorage.getItem('todos')

    if (nonParsedTodos) {
      const todos = JSON.parse(nonParsedTodos)

      todos.forEach(t => {
        switch (t.day) {
          case 'today':
            this.todayTodos.push(t)
            break
          case 'tomorrow':
            this.tomorrowTodos.push(t)
            break
          case 'someday':
            this.somedayTodos.push(t)
            break;
          default:
            console.log("Error: task with no day attached")
        }
      })
    }

    // for someday, decrement the timing for switching the task/goal to tomorrow, then save back to localstorage
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
