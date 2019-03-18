<template>
    <v-container>
        <div v-show="showVideo">
            <youtube :video-id="videoId" ref="youtube" @ready="onReady"></youtube>
        </div>
    </v-container>
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

        private async onReady(): Promise<void> {
            await this.getDuration();
            await this.player.setPlaybackQuality('small');
            this.$emit('ready');
            console.log("READY!");
        }

        @Watch('videoId')
        private async getDuration(): Promise<number> {
            console.log('Getting duration again');
            do {
                this.videoDuration = await this.player.getDuration();
            } while(! this.videoDuration);

            console.log('Got it!');
            return this.videoDuration;
        }

        private async isPlaying(): Promise<boolean> {
            return (await this.player.getPlayerState() === PlayerStates.playing);
        }

        private get player() {
            // @ts-ignore
            return this.$refs.youtube.player;
        }

        public async playRandomPoint(): Promise<void> {
            await this.player.pauseVideo();

            const playSpeed: number = 0.25;
            await this.player.setPlaybackRate(playSpeed);
            console.log(this.videoDuration);
            const randomPoint: number = randBetween(PLAY_MARGIN, this.videoDuration - PLAY_MARGIN);
            await this.player.seekTo(randomPoint, true);
            await this.player.playVideo();
            await this.awaitForVideoToPlay();
        }

        public async awaitForVideoToPlay(): Promise<void> {
            let waitCount: number = 0;
            do {
                await new Promise((resolve) => setTimeout(resolve, 750));
                if (waitCount >= 4) {
                    await this.playRandomPoint();
                    waitCount = 0;
                }
                waitCount++;
                console.log('Waiting', waitCount);
            } while (await this.player.getPlayerState() !== PlayerStates.playing);
        }

        public async reveal(): Promise<void> {
            await this.player.pauseVideo();

            await this.player.setVolume(0);
            await this.player.setPlaybackRate(1);
            await this.player.seekTo(this.revealPoint, true);
            console.log('Reveal Point', this.revealPoint);
            await this.player.playVideo();
            await this.awaitForVideoToPlay();

            this.volumeFadeIn();
            this.showVideo = true;
            this.$emit('video-revealed');
        }

        public volumeFadeIn(): void {
            let volume: number = 0;
            const fadeInInterval = setInterval(async () => {
                await this.player.setVolume(volume);
                volume += 20;
                if (volume > 100) {
                    clearInterval(fadeInInterval);
                }
            }, 500)
        }
    }
</script>
