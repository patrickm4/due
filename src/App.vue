<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="DNTL DIUTL DINTDL"/> -->
    <Today class="day-card" />
    <Tomorrow class="day-card" />
    <Someday class="day-card" />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Today from './components/Today.vue'
import Tomorrow from './components/Tomorrow.vue'
import Someday from './components/Someday.vue'

export default {
  name: 'App',
  components: {
    Today,
    Tomorrow,
    Someday
  }
}
</script>

<style>
body{ margin: 0;}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  display: inline-block;

  width:300vw;
}
.day-card{
  text-align: left;
  width: 80vw;
  /* width: 30%; */

  float: left;
}
</style>
