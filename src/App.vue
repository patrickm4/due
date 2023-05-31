<template>
  <div>
    <div class="top-bar">
      <div>
        v0.1.5
        <!-- for mobile testing -->
        <!-- TEST CHECK:{{ checkLengthTest }} logs: {{ logs }}  -->
      </div>
      <div v-if="updateExists" class="update-container">
        <span>Update available</span>
        <button @click="refreshApp">Update</button>
      </div>
    </div>
    <vue-scroll-snap :fullscreen="true" :horizontal="true">
      <Day class="item" :items="todayTodos" day-name="Today" @reloadCache="getTasks"></Day>
      <Day class="item" :items="tomorrowTodos" day-name="Tomorrow" @reloadCache="getTasks"></Day>
      <Day class="item" :items="somedayTodos" day-name="Someday" @reloadCache="getTasks"></Day>
    </vue-scroll-snap>
  </div>
</template>

<script>
import VueScrollSnap from "vue-scroll-snap";
import Day from "./components/Day.vue";
import update from "./mixins/update.js";

export default {
  name: 'App',
  components: {
    Day,
    VueScrollSnap
  },
  mixins: [update],
  data () {
    return {
      mouseDown: false,
      startX: null,
      scrollLeft: null,
      todayTodos: [],
      tomorrowTodos: [],
      somedayTodos: [],
      // below 2 vars for mobile testing
      // checkLengthTest: 0,
      // logs: [] 
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

        // this.checkLengthTest = todos ? todos.length : -1

        let todayTs = []
        let tomorrowTs = []
        let somedayTs = []

        for(var g = 0; g < todos.length;g++) {
          // this.logs.push(`start item:${JSON.stringify(todos[g])}`)
          // TODO need to handle diff timezones
          // TODO check if task has dueDate and if valid
          const nowInTimezone = new Date().toLocaleString('en-US', { timeZone: todos[g].timezone })
          const now = new Date(nowInTimezone)
          const dueDate = new Date(todos[g].due_date)
          const currentDay = now.getDate()
          const dueDay = dueDate.getDate()

          // if day is the same, and due date is less than the now date, they just made that task today - due today, push it to today
          if (currentDay === dueDay && dueDate < now) {
            todayTs.push(todos[g])
            continue
          }

          // if day is the same and due date is more than the now date, task at night for tomorrow, next day comes due date is later in the night, push today
          if(currentDay === dueDay && dueDate > now) {
            // get midnight today and see if due date is less than that
            const tempNowCheck = new Date(nowInTimezone)
            const tempNowCheckDay = tempNowCheck.getDate()
            tempNowCheck.setDate(tempNowCheckDay + 1)
            tempNowCheck.setHours(0,0,0,0)

            if (dueDate < tempNowCheck) {
              todayTs.push(todos[g])
              continue
            }
          }

          // // if day is not the same, and due date is not less than the now date, the task is due in the future, find if the task is one day ahead - push to tomorrow, else push to someday
          if (currentDay !== dueDay && dueDate > now) {
            // needed to getdate of tomorrow from now without doing currentday + 1 so that end of the month will work 
            const tempNowWithTimezone = new Date().toLocaleString('en-US', { timeZone: todos[g].timezone })
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

          // // if the day is not the same, and that the time is less than the now date, the task was made atleast a month before, push it to today,
          if (currentDay !== dueDay && dueDate < now) {
            todayTs.push(todos[g])
            continue
          }

          // **TODO** **BUG** on mobile due_date is saving as "30/05/2023, 22:19:35" instead of "05/30/2023, 10:19:35 PM"          
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
  .top-bar {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 999;
  }
  .update-container {
    margin: .45rem .75rem;
    color: #638ab1;
  }
  .update-container > span {
    margin-right: .5rem;
  }
</style>
