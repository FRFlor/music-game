<template>
    <div>
        <video-player
                class="game-video"
                @error="$emit('error')"
                :class="{'revealed' : isRevealed}"
                ref="videoPlayer"/>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import VideoPlayer from './VideoPlayer.vue';
    import {VideoQuestion} from '@/interfaces';
    import {randBetween} from '@/support';

    @Component({components: {VideoPlayer}})
    export default class GameVideo extends Vue {
        @Prop() protected size!: number;

        protected questionData: VideoQuestion | null = null;
        protected videoDuration: number = 0;
        protected readonly PLAY_MARGIN: number = 30; // Start/End seconds that won't be played during random selection

        protected isRevealed: boolean = false;

        public async startQuestion(questionData: VideoQuestion): Promise<void> {
            await this.prepareQuestionToPlay(questionData);

            await this.playRandomPoint();
            await this.volumeFadeIn();
        }

        @Watch('size')
        public async updateVideoSize(): Promise<void> {
            const desiredHeight: number = this.size;
            const desiredWidth: number = Math.round(this.size * 4 / 3);
            await this.videoPlayer.setSize(desiredWidth, desiredHeight);
        }

        public async reveal(): Promise<void> {
            if (this.questionData === null) {
                return;
            }
            await this.videoPlayer.setVolume(0);
            await this.videoPlayer.setPlaybackRate(1);
            await this.videoPlayer.seekTo(this.questionData.revealPoint, true);

            this.isRevealed = true;
            await this.volumeFadeIn();
            await this.wait(10000);
            this.isRevealed = false;
            await this.volumeFadeOut();
            await this.wait(5000);
        }

        public async playRandomPoint(): Promise<void> {
            const playSpeed: number = Math.random() < 0.5 ? 0.5 : 2;
            this.$emit('play-speed-selected', playSpeed);
            await this.videoPlayer.setPlaybackRate(playSpeed);
            const randomPoint: number = randBetween(this.PLAY_MARGIN, this.videoDuration - this.PLAY_MARGIN);
            await this.videoPlayer.seekTo(randomPoint, true);
        }

        protected async prepareQuestionToPlay(questionData: VideoQuestion): Promise<void> {
            this.isRevealed = false;
            this.questionData = questionData;
            await this.videoPlayer.selectVideo(this.questionData.videoId);
            await this.videoPlayer.setVolume(0);
            await this.videoPlayer.setPlaybackRate(1);
            await this.updateVideoSize();

            await this.videoPlayer.playVideo();
            this.videoDuration = await this.videoPlayer.getDuration();
            while (isNaN(this.videoDuration) || this.videoDuration <= 0) {
                this.videoDuration = await this.videoPlayer.getDuration();
                await this.wait(500);
            }

            this.disableYoutubeKeyboardNavigation();
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

        protected disableYoutubeKeyboardNavigation(): void {
            const youtubeIframe: HTMLIFrameElement | null = document.querySelector('iframe');
            if (youtubeIframe === null) {
               throw Error('Could not find any iframe in the DOM');
            }
            youtubeIframe.setAttribute('tabindex', '-1');
        }
    }
</script>

<style scoped lang="scss">
    .game-video {
        pointer-events: none;
        transition: opacity 5s ease;
        position: absolute;
        transform: translate(-50%, -50%);
        clip-path: circle(25%);
        opacity: 0;
        height: var(--video-size);

        &.revealed {
            opacity: 1;
        }
    }
</style>
