<template>
  <div
    id="app"
    @mousedown="startDragging"
    @mouseup="stopDragging"
    @mouseleave="stopDragging"
    @mousemove.prevent="mouseMove"
    ref="root"
  >
    <div id="app-child">
      <Today class="day-card" />
      <Tomorrow class="day-card" />
      <Someday class="day-card" />
    </div>
  </div>
</template>

<script>
import Today from './components/Today.vue'
import Tomorrow from './components/Tomorrow.vue'
import Someday from './components/Someday.vue'

export default {
  name: 'App',
  components: {
    Today,
    Tomorrow,
    Someday
  },
  data () {
    return {
      mouseDown: false,
      startX: null,
      scrollLeft: null
    }
  },
  methods: {
    startDragging (e) {
      this.mouseDown = true
      this.startX = e.pageX - this.$refs.root.offsetLeft
      this.scrollLeft =  this.$refs.root.scrollLeft
    },
    stopDragging () {
      this.mouseDown = false
    },
    mouseMove (e) {
      if(!this.mouseDown) return

      const x = e.pageX - this.$refs.root.offsetLeft
      const scroll = x - this.startX
      this.$refs.root.scrollLeft = this.scrollLeft - scroll
    }
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow-x: hidden;

  display: inline-block;

  width:100vw;
  height:100vh;
}
#app-child{
  text-align: center;
  display: inline-block;
  width:300vw;
  height:100vh;
}
.day-card{
  text-align: left;
  width: 80vw;

  float: left;
}
</style>
