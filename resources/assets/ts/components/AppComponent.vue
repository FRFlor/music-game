<template>
    <v-container>
        <game-timer ref="timer"
                    v-model="timerSeconds"
                    @time-is-up="revealAnswer"/>

        <video-player ref="videoPlayer"
                      :video-id="question.id"
                      :reveal-point="question.revealPoint"
                      @ready="onPlayerReady"/>

        <v-btn @click="questionId = 1">Change Video</v-btn>
        <v-btn @click="revealAnswer">Reveal!</v-btn>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import VideoPlayer from "./VideoPlayer.vue";
    import GameTimer from "./GameTimer.vue";

    interface VideoQuestion {
        id: string,
        song: string,
        movie: string,
        revealPoint: number,
    }

    const QuestionList: VideoQuestion[] = [
        {
            id: 'TVcLIfSC4OE',
            song: 'Make a man out of you',
            movie: 'Mulan',
            revealPoint: 90, // BE A MAN!!! We must be swift as a coursing river! ...
        },
        {
            id: 'SXKlJuO07eM',
            song: 'Part of your world',
            movie: 'Little Mermaid',
            revealPoint: 85, // Up where they walk, up where they run, up where they stay all day in the sun ...
        }
    ];

    @Component({
        components: {GameTimer, VideoPlayer}
    })
    export default class AppComponent extends Vue {

        private questionId: number = 0;
        private timerSeconds: number = 15;
        private randomJumpInterval: any;

        private get question(): VideoQuestion {
            return QuestionList[this.questionId];
        }

        private revealAnswer(): void {
            clearInterval(this.randomJumpInterval);
            return this.player.reveal();
        }

        private async keepRandomJumping(): Promise<void> {
            setTimeout(async () => {
                if (this.timerSeconds > 3) {
                    await this.player.playRandomPoint();
                    await this.keepRandomJumping();
                }
            }, 3000)
        }

        private async onPlayerReady(): Promise<void> {
            await this.player.playRandomPoint();
            this.timer.start();
            await this.keepRandomJumping();
        }

        private get player(): any {
            return this.$refs.videoPlayer;
        }

        private get timer(): any {
            return this.$refs.timer;
        }
    }
</script>
