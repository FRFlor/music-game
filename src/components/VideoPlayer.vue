<template>
    <div>
        <youtube v-if="videoId"
                 :video-id="videoId"
                 @ready="isReady = true"
                 @playing="isPlaying = true"
                 ref="youtube"></youtube>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {PlayerState, YoutubeAPI} from '../interfaces/YoutubeAPI';

    @Component
    export default class VideoPlayer extends Vue implements YoutubeAPI {
        protected videoId: string = '';
        protected isReady: boolean = false;

        public async selectVideo(videoId: string): Promise<void> {
            if (this.videoId) {
                await this.stopVideo();
            }
            this.videoId = videoId;
            await this.untilPlayerIsReady();
            return;
        }

        public async playVideo(): Promise<void> {
            await this.untilPlayerIsReady();
            await this.player.playVideo();
            await this.untilVideoStartsPlaying();
        }

        public async pauseVideo(): Promise<void> {
            await this.untilPlayerIsReady();
            await this.player.pauseVideo();
        }

        public async stopVideo(): Promise<void> {
            await this.untilPlayerIsReady();
            await this.player.stopVideo();
        }

        public async mute(): Promise<void> {
            throw new Error('Method not implemented.');
        }

        public async unMute(): Promise<void> {
            throw new Error('Method not implemented.');
        }

        public async isMuted(): Promise<void> {
            throw new Error('Method not implemented.');
        }

        public async getVolume(): Promise<number> {
            throw new Error('Method not implemented.');
        }

        public async getPlaybackRate(): Promise<void> {
            throw new Error('Method not implemented.');
        }

        public async getPlayerState(): Promise<PlayerState> {
            throw new Error('Method not implemented.');
        }

        public async setPlaybackRate(suggestedRate: number): Promise<void> {
            await this.untilPlayerIsReady();
            await this.player.setPlaybackRate(suggestedRate);
        }

        public async getDuration(): Promise<number> {
            await this.untilPlayerIsReady();
            return await this.player.getDuration();
        }

        public async seekTo(seconds: number, allowSeekAhead: boolean): Promise<void> {
            let shouldWaitUntilPlayingAgain: boolean = false;
            if (await this.player.getPlayerState() === PlayerState.playing) {
                shouldWaitUntilPlayingAgain = true;
            }

            await this.untilPlayerIsReady();
            await this.player.seekTo(seconds, allowSeekAhead);

            if (shouldWaitUntilPlayingAgain) {
                await this.untilVideoStartsPlaying();
            }
        }

        public async setVolume(volume: number): Promise<void> {
            return await this.player.setVolume(volume);
        }

        protected async pollUntilTrue(cb: () => Promise<boolean>): Promise<void> {
            if (await cb()) {
                return;
            }

            setTimeout(() => this.pollUntilTrue(cb), 500);
        }

        protected async untilPlayerIsReady(): Promise<void> {
            if (this.videoId === '') {
                throw new Error('A video must be selected first before any other action can be taken');
            }

            const playerIsReady = async (): Promise<boolean> => {
                return this.isReady;
            };

            return await this.pollUntilTrue(playerIsReady);
        }

        protected async untilVideoStartsPlaying(): Promise<void> {
            const isPlaying = async (): Promise<boolean> => {
                return await this.player.getPlayerState() === PlayerState.playing;
            };

            return await this.pollUntilTrue(isPlaying);
        }

        protected get player(): YoutubeAPI {
            // @ts-ignore
            return this.$refs.youtube.player;
        }
    }
</script>

<style scoped lang="scss">
</style>
