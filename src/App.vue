<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">
        <VideoPlayer ref="videoPlayer"/>
        <button @click="playQuestion">Play playQuestion</button>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import VideoPlayer from '@/components/VideoPlayer.vue';
    import {QUESTION_LIST} from '@/storage/questionList';

    @Component({
        components: {
            VideoPlayer,
        },
    })
    export default class App extends Vue {

        protected async playQuestion(): Promise<void> {
            const questionId = Math.floor(Math.random() * QUESTION_LIST.length);
            await this.videoPlayer.selectVideo(QUESTION_LIST[questionId].id);
            await this.videoPlayer.playVideo();
        }

        protected get videoPlayer(): VideoPlayer {
            // @ts-ignore
            return this.$refs.videoPlayer;
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
