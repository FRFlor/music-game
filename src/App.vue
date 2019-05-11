<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <VideoPlayer ref="videoPlayer"/>
    <button @click="playDespacito">Play Despacito</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VideoPlayer from './components/VideoPlayer.vue';

@Component({
  components: {
    VideoPlayer,
  },
})
export default class App extends Vue {

  protected playDespacito(): void {
    // @ts-ignore
    this.$refs.videoPlayer.selectVideo('lG0Ys-2d4MA');
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
