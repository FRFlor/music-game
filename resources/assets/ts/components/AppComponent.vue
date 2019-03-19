<template>
    <div id="app">
        <v-app id="musicgame">
            <v-container app fluid class="app-container">
                <v-layout>
                    <v-flex v-text="`Your score: ${playerPoints}`"
                            class="headline light-blue--text text--darken-1 mb-4"></v-flex>
                </v-layout>

                <v-layout wrap>
                    <v-flex xs12 sm4>
                        <v-autocomplete
                                v-model="movieAnswer"
                                :items="movies"
                                label="What movie is this song from?"
                                :readonly="timerSeconds === 0"
                                :success="timerSeconds === 0 && movieIsRight"
                                :error="timerSeconds === 0 && ! movieIsRight"
                                prepend-icon="fas fa-film"
                        ></v-autocomplete>
                    </v-flex>

                    <v-flex xs12 order-sm-4>
                        <div v-if="timerSeconds === 0">
                            <div class="text-center"
                                 v-text="resultMessage"
                                 :class="songIsRight || movieIsRight ? 'green--text' : 'red--text'"></div>

                            <div class="text-center"
                                 :class="songIsRight || movieIsRight ? 'green--text' : 'red--text'">
                                {{question.movie}} - {{question.song}}
                            </div>
                        </div>
                    </v-flex>

                    <v-flex xs12 sm4>
                        <game-timer ref="timer"
                                    class="justify-center my-3"
                                    v-model="timerSeconds"
                                    :success="songIsRight || movieIsRight"
                                    @time-is-up="revealAnswer">
                            <div v-show="timerSeconds > 0">{{timerSeconds}}s</div>
                            <video-player ref="videoPlayer"
                                          v-show="timerSeconds === 0"
                                          :video-id="question.id"
                                          :reveal-point="question.revealPoint"
                                          @reveal-finished="getNextQuestion"
                                          @ready="onPlayerReady"/>
                        </game-timer>
                    </v-flex>

                    <v-flex xs12 sm4>
                        <v-autocomplete
                                v-model="songAnswer"
                                :items="songs"
                                label="What song is this?"
                                prepend-icon="fas fa-music"
                                :readonly="timerSeconds === 0"
                                :success="timerSeconds === 0 && songIsRight"
                                :error="timerSeconds === 0 && ! songIsRight"
                        ></v-autocomplete>
                    </v-flex>

                    <v-flex xs12>
                        <div class="text-center mt-5">
                            <v-btn color="light-blue darken-1"
                                   class="justify-center"
                                   @click="skipToAnswer"
                                   :disabled="!canSkip"
                                   outline
                                   round large>Answer
                            </v-btn>
                        </div>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-app>
    </div>

</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import VideoPlayer from "./VideoPlayer.vue";
    import GameTimer from "./GameTimer.vue";

    // :color="timerSeconds > 0 ? 'grey' :  movieIsRight ? 'green' : 'red'"
    interface VideoQuestion {
        id: string,
        song: string,
        movie: string,
        revealPoint: number,
    }

    const QUESTION_LIST: VideoQuestion[] = [
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

    const QUESTION_TIME: number = 25;

    @Component({
        components: {GameTimer, VideoPlayer}
    })
    export default class AppComponent extends Vue {

        private questionId: number = 0;
        private timerSeconds: number = QUESTION_TIME;

        private movieAnswer: string = "";
        private songAnswer: string = "";
        private playerPoints: number = 0;

        private get question(): VideoQuestion {
            return QUESTION_LIST[this.questionId];
        }

        private skipToAnswer(): void {
            if (this.timerSeconds > 3) {
                this.timerSeconds = 3;
            }
        }

        private get canSkip(): boolean {
            return this.timerSeconds > 3;
        }

        private async revealAnswer(): Promise<void> {
            if (this.movieAnswer === this.question.movie) {
                this.playerPoints += 2;
            }

            if (this.songAnswer === this.question.song) {
                this.playerPoints += 3;
            }

            await this.player.reveal();
        }

        private async keepRandomJumping(): Promise<void> {
            setTimeout(async () => {
                if (this.timerSeconds > this.hintPlaySeconds) {
                    await this.player.playRandomPoint();
                    await this.keepRandomJumping();
                }
            }, this.hintPlaySeconds * 1000)
        }

        private getNextQuestion() {
            this.songAnswer = "";
            this.movieAnswer = "";
            this.timer.stop();
            this.questionId = 1;
            this.timerSeconds = QUESTION_TIME;
        }

        private async onPlayerReady(): Promise<void> {
            await this.player.playRandomPoint();
            this.timer.start();
            await this.keepRandomJumping();
        }

        private get movieIsRight(): boolean {
            return this.movieAnswer === this.question.movie;
        }

        private get songIsRight(): boolean {
            return this.songAnswer === this.question.song;
        }

        private get player(): any {
            return this.$refs.videoPlayer;
        }

        private get timer(): any {
            return this.$refs.timer;
        }

        private get hintPlaySeconds(): number {
            return Math.floor(QUESTION_TIME / 4);
        }

        private get movies(): string[] {
            return QUESTION_LIST.map((question: VideoQuestion) => question.movie);
        }

        private get songs(): string[] {
            return QUESTION_LIST.map((question: VideoQuestion) => question.song);
        }

        private get resultMessage(): string {
            return (this.movieIsRight && this.songIsRight)
                ? "Perfect! Well Done!"
                : this.movieIsRight || this.songIsRight
                    ? "Good!"
                    : "Sorry! Better luck next time!";
        }
    }
</script>

<style scoped lang="scss">
    .app-container {
        max-width: 920px;
    }

</style>
