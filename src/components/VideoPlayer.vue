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
    import {YoutubeAPI} from '../interfaces/YoutubeAPI';

    export {YoutubeAPI};

    @Component
    export default class VideoPlayer extends Vue implements YoutubeAPI {
        protected videoId: string = '';
        protected isReady: boolean = false;
        protected isPlaying: boolean = false;

        public async selectVideo(videoId: string): Promise<void> {
            if (this.videoId) {
                await this.stopVideo();
            }
            this.videoId = videoId;
            this.isReady = false;
            await this.untilPlayerIsReady();
            return;
        }

        public async playVideo(): Promise<void> {
            await this.untilPlayerIsReady();
            await this.player.playVideo();
            await this.untilVideoStartsPlaying();
        }

        public async stopVideo(): Promise<void> {
            if (this.videoId.length === 0) {
                return;
            }
            await this.untilPlayerIsReady();
            await this.player.stopVideo();
            this.isPlaying = false;
        }

        public mute(): Promise<void> {
            throw new Error('Method not implemented.');
        }

        public unMute(): Promise<void> {
            throw new Error('Method not implemented.');
        }

        public isMuted(): Promise<void> {
            throw new Error('Method not implemented.');
        }

        public getVolume(): Promise<number> {
            throw new Error('Method not implemented.');
        }

        public getPlaybackRate(): Promise<void> {
            throw new Error('Method not implemented.');
        }

        public setPlaybackRate(suggestedRate: number): Promise<void> {
            throw new Error('Method not implemented.');
        }

        public getDuration(): Promise<number> {
            throw new Error('Method not implemented.');
        }

        public pauseVideo(): Promise<void> {
            throw new Error('Method not implemented.');
        }

        public seekTo(seconds: number, allowSeekAhead: boolean): Promise<void> {
            throw new Error('Method not implemented.');
        }

        public async setVolume(volume: number): Promise<void> {
            return await this.player.setVolume(volume);
        }

        protected async pollUntilTrue(testee: boolean): Promise<void> {
            if (testee) {
                return;
            }

            setTimeout(() => this.pollUntilTrue(this.isReady), 200);
        }

        protected async untilPlayerIsReady(): Promise<void> {
            return await this.pollUntilTrue(this.isReady);
        }

        protected async untilVideoStartsPlaying(): Promise<void> {
            return await this.pollUntilTrue(this.isPlaying);
        }

        protected get player(): YoutubeAPI {
            // @ts-ignore
            return this.$refs.youtube.player;
        }
    }
</script>

<style scoped lang="scss">
</style>
