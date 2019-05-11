<template>
    <div>
        <youtube v-if="videoId"
                 :video-id="videoId"
                 @ready="onVideoReady"
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
        }

        public async stopVideo(): Promise<void> {
            if (this.videoId.length === 0) {
                return;
            }
            await this.untilPlayerIsReady();
            await this.player.stopVideo();
        }

        protected onVideoReady(): void {
            this.isReady = true;
        }

        protected async untilPlayerIsReady(): Promise<void> {
            const pollUntilTrue = async (testee: boolean) => {
                if (testee) {
                    return;
                }
                setTimeout(() => pollUntilTrue(this.isReady), 200);
            };

            return await pollUntilTrue(this.isReady);
        }

        protected get player(): YoutubeAPI {
            // @ts-ignore
            return this.$refs.youtube.player;
        }
    }
</script>

<style scoped lang="scss">
</style>
