<template>
    <v-container>
        <div v-show="showVideo">
            <youtube :video-id="videoId" ref="youtube" @ready="onReady"></youtube>
        </div>
    </v-container>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'

    enum PlayerStates {
        unstarted = -1,
        ended = 0,
        playing = 1,
        paused = 2,
        buffering = 3,
        videoCued = 5
    }

    const PLAY_MARGIN: number = 10; // Start/End seconds that won't be played during random selection

    const randBetween = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    @Component
    export default class VideoPlayer extends Vue {
        @Prop() private videoId!: string;
        private revealPoint: number = -1;

        private showVideo: boolean = false;
        private videoDuration: number = 0;

        private async onReady(): Promise<void> {
            await this.getDuration();
            await this.player.setPlaybackQuality('small');

            this.$emit('ready');
        }

        private async getDuration(): Promise<number> {
            this.videoDuration = await this.player.getDuration();

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
            const isPlaying: boolean = await this.isPlaying();

            if (!isPlaying) {
                await this.player.playVideo();
            }

            const playSpeed: number = Math.random() < 0.5 ? 0.25 : 2;
            await this.player.setPlaybackRate(playSpeed);
            const randomPoint: number = randBetween(PLAY_MARGIN, this.videoDuration - PLAY_MARGIN);
            await this.player.seekTo(randomPoint, true);
            await this.awaitForVideoToPlay();
        }

        public async awaitForVideoToPlay(): Promise<void> {
            do {
                await new Promise((resolve) => setTimeout(resolve, 500));
            } while (await this.player.getPlayerState() !== PlayerStates.playing);
        }

        public async reveal(): Promise<void> {
            await this.player.pauseVideo();
            await this.player.setVolume(0);
            const effectiveRevealPoint = (this.revealPoint === -1)
                ? randBetween(PLAY_MARGIN, this.videoDuration - PLAY_MARGIN)
                : this.revealPoint;

            await this.player.setPlaybackRate(1);

            if (this.revealPoint === -1) {
                await this.player.seekTo(effectiveRevealPoint, true);
            }

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
