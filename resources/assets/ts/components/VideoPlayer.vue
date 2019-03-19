<template>
    <v-layout>
        <div class="video-container" :class="{'revealed' : showVideo}">
            <youtube :video-id="videoId" ref="youtube" @ready="onReady"></youtube>
        </div>
    </v-layout>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator'

    enum PlayerStates {
        unstarted = -1,
        ended = 0,
        playing = 1,
        paused = 2,
        buffering = 3,
        videoCued = 5
    }

    const PLAY_MARGIN: number = 30; // Start/End seconds that won't be played during random selection

    const randBetween = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    @Component
    export default class VideoPlayer extends Vue {
        @Prop() private videoId!: string;
        @Prop() private revealPoint!: number;

        private showVideo: boolean = false;
        private videoDuration: number = 0;

        private mounted() {
            this.player.setSize(280, 210);
        }

        private async onReady(): Promise<void> {
            this.$emit('loading-message', 'Youtube connection established...');
            await this.prepareVideo();
        }

        @Watch('videoId')
        private async prepareVideo(): Promise<void> {
            this.$emit('loading-message', 'Getting video duration...');
            do {
                this.videoDuration = await this.player.getDuration();
                await this.wait(500);
            } while (!this.videoDuration);
            await this.player.setVolume(100);
            this.$emit('loading-message', 'Switching to random start...');
            await this.playRandomPoint();

            this.$emit('loading-message', 'Ready to go!');
            this.$emit('ready');
        }

        private get player() {
            // @ts-ignore
            return this.$refs.youtube.player;
        }

        public async stopVideo() {
            return await this.player.stopVideo();
        }

        public async playRandomPoint(): Promise<void> {
            const playSpeed: number = Math.random() < 0.5 ? 0.25 : 2;
            await this.player.setPlaybackRate(playSpeed);
            const randomPoint: number = randBetween(PLAY_MARGIN, this.videoDuration - PLAY_MARGIN);
            await this.player.seekTo(randomPoint, true);
            await this.awaitForVideoToPlay();
        }

        public async awaitForVideoToPlay(): Promise<void> {
            let waitCount: number = 0;
            do {
                await this.wait(750);
                if (waitCount >= 6) {
                    this.$emit('loading-message', 'Failed to play... Retrying....');
                    return await this.playRandomPoint();
                }
                waitCount++;
            } while (await this.player.getPlayerState() !== PlayerStates.playing);
        }

        public async reveal(): Promise<void> {
            await this.player.pauseVideo();

            await this.player.setVolume(0);
            await this.player.setPlaybackRate(1);
            await this.player.seekTo(this.revealPoint, true);
            await this.player.playVideo();
            await this.awaitForVideoToPlay();

            this.showVideo = true;
            await this.volumeFadeIn();
            await this.wait(10000);
            this.showVideo = false;
            await this.volumeFadeOut();
            await this.wait(5000);
            this.$emit('reveal-finished');
        }

        public async volumeFadeIn(): Promise<void> {
            await this.volumeFade(20);
        }

        public async volumeFadeOut(): Promise<void> {
            await this.volumeFade(-20);
        }

        private async volumeFade(delta: number): Promise<void> {
            let volume: number = delta > 0 ? 0 : 100;
            const fadeInterval = setInterval(async () => {
                await this.player.setVolume(volume);
                volume += delta;
                const shouldStop: boolean = delta > 0 ? (volume > 100) : (volume < 0);
                if (shouldStop) {
                    clearInterval(fadeInterval);
                    return;
                }
            }, 500)
        }

        private async wait(ms: number): Promise<void> {
            await new Promise((resolve) => setTimeout(resolve, ms));
        }
    }
</script>


<style scoped lang="scss">
    .video-container {
        transition: opacity 5s ease;
        clip-path: circle(30%);
        opacity: 0;
        &.revealed {
            opacity: 1;
            height: 210px;
        }
    }
</style>
