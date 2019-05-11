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

    @Component({ components: {VideoPlayer} })
    export default class GameVideo extends Vue {
        protected questionData: VideoQuestion | null = null;

        protected isRevealed: boolean = false;

        public async startQuestion(questionData: VideoQuestion): Promise<void> {
            this.questionData = questionData;
            await this.videoPlayer.selectVideo(this.questionData.videoId);
            await this.videoPlayer.setVolume(0);
            await this.videoPlayer.playVideo();
            await this.volumeFadeIn();
            this.isRevealed = true;
        }

        public async volumeFadeIn(): Promise<void> {
            await this.volumeFade(20);
        }

        public async volumeFadeOut(): Promise<void> {
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
