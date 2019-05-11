<template>
    <div>
        <video-player
                class="game-video"
                :class="{'revealed' : isRevealed}"
                ref="videoPlayer"/>
        <button @click="playRandomPoint">Random</button>
    </div>

</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import VideoPlayer from './VideoPlayer.vue';
    import {VideoQuestion} from '@/interfaces';
    import {QUESTION_LIST} from '@/storage/questionList';
    import {randBetween} from '@/support';

    @Component({ components: {VideoPlayer} })
    export default class GameVideo extends Vue {
        protected questionData: VideoQuestion | null = null;
        protected videoDuration: number = 0;
        protected readonly PLAY_MARGIN: number = 30; // Start/End seconds that won't be played during random selection

        protected isRevealed: boolean = false;

        public async startQuestion(questionData: VideoQuestion): Promise<void> {
            await this.prepareQuestionToPlay(questionData);

            await this.playRandomPoint();
            await this.volumeFadeIn();
            this.isRevealed = true;
        }

        public async playRandomPoint(): Promise<void> {
            const playSpeed: number = Math.random() < 0.5 ? 0.25 : 2;
            await this.videoPlayer.setPlaybackRate(playSpeed);
            const randomPoint: number = randBetween(this.PLAY_MARGIN, this.videoDuration - this.PLAY_MARGIN);
            await this.videoPlayer.seekTo(randomPoint, true);
        }

        protected async prepareQuestionToPlay(questionData: VideoQuestion): Promise<void> {
            this.questionData = questionData;
            await this.videoPlayer.selectVideo(this.questionData.videoId);
            await this.videoPlayer.setVolume(0);
            await this.videoPlayer.setPlaybackRate(1);

            await this.videoPlayer.playVideo();
            this.videoDuration = await this.videoPlayer.getDuration();
            while(isNaN(this.videoDuration) || this.videoDuration <= 0) {
                this.videoDuration = await this.videoPlayer.getDuration();
                await this.wait(500);
            }
        }

        protected async volumeFadeIn(): Promise<void> {
            await this.volumeFade(20);
        }

        protected async volumeFadeOut(): Promise<void> {
            await this.volumeFade(-20);
        }

        protected async volumeFade(delta: number): Promise<void> {
            let volume: number = delta > 0 ? 0 : 100;
            const fadeInterval = setInterval(async () => {
                await this.videoPlayer.setVolume(volume);
                volume += delta;
                const shouldStop: boolean = delta > 0 ? (volume > 100) : (volume < 0);
                if (shouldStop) {
                    clearInterval(fadeInterval);
                    return;
                }
            }, 500);
        }

        protected get videoPlayer(): VideoPlayer {
            // @ts-ignore
            return this.$refs.videoPlayer;
        }

        protected async wait(ms: number): Promise<void> {
            await new Promise((resolve) => setTimeout(resolve, ms));
        }
    }
</script>

<style scoped lang="scss">
    .game-video {
        transition: all 1s ease;
        opacity: 0;
        &.revealed {
            opacity: 1;
        }
    }
</style>
