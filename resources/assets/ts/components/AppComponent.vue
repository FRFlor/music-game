<template>
    <div id="app">
        <v-app id="musicgame">
            <v-container app fluid class="app-container">
                <v-layout wrap row>
                    <v-flex xs12 aria-describedby="Scoreboard"
                            v-text="`Your score: ${playerPoints}`"
                            class="headline light-blue--text text--darken-1 mb-4"></v-flex>
                </v-layout>
                <v-layout wrap row>
                    <v-flex xs12 sm4 aria-describedby="Movie Answer Input">
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

                    <v-flex xs12 sm4 aria-describedby="Timer and Video">
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

                    <v-flex xs12 order-sm4 aria-describedby="Result Message">
                        <div class="text-center">MESSAGE</div>
                        <div v-show="timerSeconds === 0">
                            <div class="text-center"
                                 v-text="resultMessage"
                                 :class="songIsRight || movieIsRight ? 'green--text' : 'red--text'"></div>

                            <div class="text-center"
                                 :class="songIsRight || movieIsRight ? 'green--text' : 'red--text'">
                                {{question.movie}} - {{question.song}}
                            </div>
                        </div>
                    </v-flex>

                    <v-flex xs12 sm4 aria-describedby="Song Answer Input">
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
                </v-layout>
                <v-layout wrap row>
                    <v-flex xs12 aria-describedby="Skip to Result">
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
    import {QUESTION_LIST, VideoQuestion} from '../questions';

    const QUESTION_TIME: number = 25;

    @Component({
        components: {GameTimer, VideoPlayer}
    })
    export default class AppComponent extends Vue {

        private questionId: number = 1;
        private timerSeconds: number = QUESTION_TIME;
        private questionIdsUsed: number[] = [];

        private movieAnswer: string = "";
        private songAnswer: string = "";
        private playerPoints: number = 0;

        private created() {
            this.questionId = Math.floor(Math.random() * QUESTION_LIST.length);
            this.questionIdsUsed.push(this.questionId);
        }

        private get question(): VideoQuestion {
            return QUESTION_LIST[this.questionId];
        }

        private skipToAnswer(): void {
            if (this.timerSeconds > 3) {
                this.timerSeconds = 3;
            }
        }

        private get canSkip(): boolean {
            return this.timerSeconds < QUESTION_TIME - 3 && this.timerSeconds > 3;
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
            this.timerSeconds = QUESTION_TIME;
            let candidate: number = 0;
            do {
                candidate = Math.floor(Math.random() * QUESTION_LIST.length)
            } while (this.questionIdsUsed.indexOf(candidate) !== -1);
            this.questionId = candidate;
            this.questionIdsUsed.push(this.questionId);
            if (this.questionIdsUsed.length === QUESTION_LIST.length) {
                this.questionIdsUsed = [];
            }
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
