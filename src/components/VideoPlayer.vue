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

    @Component
    export default class HelloWorld extends Vue {
        protected videoId: string = '';
        protected isReady: boolean = false;
        protected renderVideo: boolean = false;

        public async selectVideo(videoId: string): Promise<void> {
            this.videoId = videoId;
            this.isReady = false;
            await this.untilPlayerIsReady();
            return;
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

        protected get player(): any {
            // @ts-ignore
            return this.$refs.youtube.player;
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
