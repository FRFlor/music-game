<template>
    <video-player
            class="game-video"
            :class="{'revealed' : isRevealed}"
            ref="videoPlayer"/>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import VideoPlayer from './VideoPlayer.vue';
    import {QUESTION_LIST, VideoQuestion} from '@/storage/questionList';

    @Component({
        components: {VideoPlayer}
    })
    export default class GameVideo extends Vue {
        protected questionData: VideoQuestion | null = null;

        protected isRevealed: boolean = false;

        public async startQuestion(questionData: VideoQuestion): Promise<void> {
            this.questionData = questionData;
            await this.videoPlayer.selectVideo(this.questionData.videoId);
            await this.videoPlayer.playVideo();
        }

        protected get videoPlayer(): VideoPlayer {
            // @ts-ignore
            return this.$refs.videoPlayer;
        }
    }
</script>

<style scoped lang="scss">
    .game-video {
        opacity: 0;
        &.revealed {
            opacity: 1;
        }
    }
</style>
