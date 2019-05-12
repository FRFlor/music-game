<template>
    <v-app id="musicgame" style="background: transparent;">
        <v-container app class="music-game elevation-5">
            <!--Scoreboard-->
            <span v-text="`Your score: ${playerPoints}`"
                  class="headline light-blue--text text--darken-1 mb-4"></span>

            <!--Movie Answer Input-->
            <v-autocomplete
                    class="input-box"
                    v-model="movieAnswer"
                    :items="movies"
                    label="What movie is this song from?"
                    :readonly="secondsRemaining === 0"
                    :success="secondsRemaining === 0 && movieIsRight"
                    :error="secondsRemaining === 0 && ! movieIsRight"
                    prepend-icon="fas fa-film"
            ></v-autocomplete>

            <!--Timer and Video-->
            <game-timer ref="timer"
                        class="my-3"
                        :size="diameterOfTimer"
                        v-model="secondsRemaining"
                        @time-is-up="revealAnswer">
                <v-btn fab dark
                       v-if="!gameHasStarted"
                       class="start-button"
                       @click="playQuestion">
                    Start Game
                </v-btn>
                <div v-show="secondsRemaining > 0 && gameHasStarted" v-text="">{{secondsRemaining}}s</div>
                <game-video ref="gameVideo"
                            :size="videoPlayerSize"
                            :question-data="currentQuestion"/>
            </game-timer>

            <!--Messages-->
            <div class="messages" v-if="loadingMessage.length > 0 || resultMessage.length > 0">
                <div v-if="loadingMessage.length > 0"
                     class="text-xs-center light-blue--text text--darken-4"
                     v-text="loadingMessage"></div>
                <div v-else-if="secondsRemaining === 0">
                    <div class="text-xs-center"
                         v-text="resultMessage"
                         :class="songIsRight || movieIsRight ? 'green--text' : 'red--text'"></div>

                    <div class="text-xs-center"
                         :class="songIsRight || movieIsRight ? 'green--text' : 'red--text'">
                        {{currentQuestion.movie}} - {{currentQuestion.song}}
                    </div>
                </div>
            </div>

            <!--Song Answer Input-->
            <v-autocomplete
                    class="input-box"
                    v-model="songAnswer"
                    :items="songs"
                    label="What song is this?"
                    prepend-icon="fas fa-music"
                    :readonly="secondsRemaining === 0"
                    :success="secondsRemaining === 0 && songIsRight"
                    :error="secondsRemaining === 0 && ! songIsRight"
            ></v-autocomplete>

            <!--Skip to Result-->
            <v-btn color="light-blue darken-1"
                   @click="skipToAnswer"
                   :disabled="!canSkip"
                   outline
                   round large>
                Answer
            </v-btn>
        </v-container>
    </v-app>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import GameVideo from '@/components/GameVideo.vue';
    import {QUESTION_LIST} from './storage/questionList';
    import {VideoQuestion} from '@/interfaces';
    import GameTimer from '@/components/GameTimer.vue';

    @Component({
        components: {
            GameTimer,
            GameVideo,
        },
    })
    export default class App extends Vue {
        protected currentQuestion: VideoQuestion = QUESTION_LIST[0];
        protected indexesOfQuestionsUsed: number[] = [];
        protected readonly TIME_PER_QUESTION: number = 15;
        protected secondsRemaining: number = this.TIME_PER_QUESTION;
        protected readonly videoPlayerSize: number = 350;

        protected loadingMessage: string = '';
        protected gameHasStarted: boolean = false;

        protected movieAnswer: string = '';
        protected songAnswer: string = '';
        protected playerPoints: number = 0;

        @Watch('videoPlayerSize')
        protected onVideoPlayerSizeChanged(): void {
            document.documentElement.style.setProperty('--video-size', `${this.videoPlayerSize}px`);
        }

        protected created(): void {
            this.onVideoPlayerSizeChanged();
        }

        protected async playQuestion(): Promise<void> {
            this.gameHasStarted = true;
            this.getNextQuestion();

            await this.gameVideo.startQuestion(this.currentQuestion);
            this.loadingMessage = '';
            this.timer.start();
        }

        protected getNextQuestion(): void {
            this.loadingMessage = 'Loading Question...';

            this.songAnswer = '';
            this.movieAnswer = '';
            this.timer.stop();
            this.secondsRemaining = this.TIME_PER_QUESTION;
            let candidate: number = 0;
            do {
                candidate = Math.floor(Math.random() * QUESTION_LIST.length);
            } while (this.indexesOfQuestionsUsed.includes(candidate));
            this.indexesOfQuestionsUsed.push(candidate);
            this.currentQuestion = QUESTION_LIST[candidate];
            if (this.indexesOfQuestionsUsed.length === QUESTION_LIST.length) {
                this.indexesOfQuestionsUsed = [];
            }
        }

        protected async revealAnswer(): Promise<void> {
            if (this.movieAnswer === this.currentQuestion.movie) {
                this.playerPoints += 2;
            }

            if (this.songAnswer === this.currentQuestion.song) {
                this.playerPoints += 3;
            }

            await this.gameVideo.reveal();

            await this.playQuestion();
        }

        protected get diameterOfTimer(): number {
            return Math.round(this.videoPlayerSize * 0.65);
        }

        protected skipToAnswer(): void {
            if (this.secondsRemaining > 3) {
                this.secondsRemaining = 3;
            }
        }

        protected get canSkip(): boolean {
            return this.secondsRemaining > 3 && this.secondsElapsed > 3;
        }

        protected get movieIsRight(): boolean {
            return this.movieAnswer === this.currentQuestion.movie;
        }

        protected get songIsRight(): boolean {
            return this.songAnswer === this.currentQuestion.song;
        }

        protected get secondsElapsed(): number {
            return this.TIME_PER_QUESTION - this.secondsRemaining;
        }

        protected get movies(): string[] {
            return QUESTION_LIST.map((question: VideoQuestion) => question.movie).sort();
        }

        protected get songs(): string[] {
            return QUESTION_LIST.map((question: VideoQuestion) => question.song).sort();
        }

        protected get resultMessage(): string {
            return (this.movieIsRight && this.songIsRight)
                ? 'Perfect! Well Done!'
                : this.movieIsRight || this.songIsRight
                    ? 'Good!'
                    : 'Sorry! Better luck next time!';
        }

        protected get gameVideo(): GameVideo {
            // @ts-ignore
            return this.$refs.gameVideo;
        }

        private get timer(): GameTimer {
            // @ts-ignore
            return this.$refs.timer;
        }
    }
</script>

<style lang="scss" scoped>
    .music-game {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 450px;
        max-height: 800px;
        background-color: hsla(200, 100%, 95%, 0.9);
        outline: hsla(210, 100%, 56%, 0.65) solid 6px;
    }

    .input-box {
        width: 300px;
        display: flex;
        align-items: center;
    }

    .start-button {
        height: 230px;
        width: 230px;
        font-size: 2rem;
        background-color: hsla(120, 50%, 30%, 0.9) !important;

        &:focus {
            background-color: hsla(170, 70%, 30%, 0.9) !important;
        }
    }
</style>
