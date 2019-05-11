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
    import {YoutubeAPI} from '../classes/YoutubeAPI';

    export {YoutubeAPI};

    @Component
    export default class VideoPlayer extends Vue {
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
