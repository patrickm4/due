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

        for(var g = 0; g < todos.length;g++) {
          // TODO need to handle diff timezones
          // TODO check if task has dueDate and if valid
          const nowInTimezone = new Date().toLocaleString({ timeZone: todos[g].timezone })
          const now = new Date(nowInTimezone)
          const dueDate = new Date(todos[g].due_date)
          const currentDay = now.getDate()
          const dueDay = dueDate.getDate()

          // if day is the same, and due date is less than the now date, they just made that task today - due today, push it to today
          if (currentDay === dueDay && dueDate < now) {
            todayTs.push(todos[g])
            continue
          }

          // if day is not the same, and due date is not less than the now date, the task is due in the future, find if the task is one day ahead - push to tomorrow, else push to someday
          if (currentDay !== dueDay && dueDate > now) {
            // needed to getdate of tomorrow from now without doing currentday + 1 so that end of the month will work 
            const tempNowWithTimezone = new Date().toLocaleString({ timeZone: todos[g].timezone })
            const tempNow = new Date(tempNowWithTimezone)
            const tempNowDay = tempNow.getDate()
            tempNow.setDate(tempNowDay + 1)
            const temp = new Date(tempNow)
            const tempDay = temp.getDate()

            if (tempDay === dueDay) {
              tomorrowTs.push(todos[g])
            } else {
              // more than a day ahead
              somedayTs.push(todos[g])
            }
            continue
          }

          // if the day is not the same, and that the time is less than the now date, the task was made atleast a month before, push it to today,
          if (currentDay !== dueDay && dueDate < now) {
            todayTs.push[todos[g]]
          }
        }

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
