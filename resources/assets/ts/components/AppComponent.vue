<template>
    <v-container>
        <video-player :video-id="videoId" ref="videoPlayer"/>
        <v-btn @click="videoId = 'SXKlJuO07eM'">Change Video</v-btn>
        <v-btn @click="playRandomPoint">Random!</v-btn>
        <v-btn @click="revealAnswer">Reveal!</v-btn>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import VideoPlayer from "./VideoPlayer.vue";
    @Component({
        components: {VideoPlayer}
    })
    export default class AppComponent extends Vue {
        private videoId: string = 'TVcLIfSC4OE';

        private get player(): any {
            return this.$refs.videoPlayer;
        }

        private playRandomPoint(): void {
            return this.player.playRandomPoint();
        }

        private revealAnswer(): void {
            return this.player.reveal();
        }
    }
</script>
