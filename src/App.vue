<template>  
  <vue-scroll-snap :fullscreen="true" :horizontal="true">
    <Day class="item" day-name="Today"></Day>
    <Day class="item" day-name="Tomorrow"></Day>
    <Day class="item" day-name="Someday"></Day>
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
      scrollLeft: null
    }
  },
  mounted () {
    // get localStorage todos
    // todays, tomorrows and somedays
    // then pass to components

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
