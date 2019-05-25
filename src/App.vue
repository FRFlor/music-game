<template>
    <v-app id="musicgame" style="background: transparent;">
        <v-container class="music-game pb-5 elevation-5">
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

            <div class="text-xs-center"
                 v-show="secondsRemaining === 0"
                 :class="messageColourClass">
                {{currentQuestion.movie}} - {{currentQuestion.song}}
            </div>

            <!--Timer and Video-->
            <game-timer ref="timer"
                        class="my-3"
                        :size="diameterOfTimer"
                        v-model="secondsRemaining"
                        :success="songIsRight || movieIsRight"
                        @time-is-up="revealAnswer">
                <v-btn fab dark
                       v-if="!gameHasStarted"
                       class="start-button"
                       @click="playNextQuestion">
                    Start Game
                </v-btn>
                <div v-show="secondsRemaining > 0 && gameHasStarted" v-text="">{{secondsRemaining}}s</div>
                <game-video ref="gameVideo"
                            @error="onError"
                            @play-speed-selected="(speedMultiplier) => message = `Playing at ${speedMultiplier}x speed...`"
                            :size="videoPlayerSize"
                            :question-data="currentQuestion"/>
            </game-timer>

            <!--Messages-->
            <div v-show="message.length > 0"
                 class="text-xs-center"
                 :class="messageColourClass"
                 v-text="message"></div>

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
        <app-footer/>
    </v-app>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import GameVideo from '@/components/GameVideo.vue';
    import {QUESTION_LIST} from './storage/questionList';
    import {VideoQuestion} from '@/interfaces';
    import GameTimer from '@/components/GameTimer.vue';
    import AppFooter from '@/components/AppFooter.vue';

    @Component({
        components: {
            AppFooter,
            GameTimer,
            GameVideo,
        },
    })
    export default class App extends Vue {
        protected indexOfCurrentQuestion: number = 0;
        protected indexesOfQuestionsUsed: number[] = [];
        protected readonly TIME_PER_QUESTION: number = 25;
        protected secondsRemaining: number = this.TIME_PER_QUESTION;
        protected readonly videoPlayerSize: number = 350;
        protected randomJumpInterval: any;

        protected message: string = `Can you guess the song?
        Audio will be played at random speeds and random points.
        You'll have ${this.TIME_PER_QUESTION} seconds to guess!`;

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

        protected async onError(): Promise<void> {
            await this.playNextQuestion();
        }

        protected async playNextQuestion(): Promise<void> {
            this.gameHasStarted = true;
            this.message = 'Loading Question...';

            this.songAnswer = '';
            this.movieAnswer = '';
            this.timer.stop();
            this.secondsRemaining = this.TIME_PER_QUESTION;

            this.selectNextQuestion();

            await this.gameVideo.startQuestion(this.currentQuestion);

            if (this.randomJumpInterval) {
                clearInterval(this.randomJumpInterval);
            }

            this.randomJumpInterval = setInterval( async () => {
                await this.gameVideo.playRandomPoint();
            }, 5000);

            setTimeout(() => this.timer.start(), 1500);
        }

        protected selectNextQuestion(): void {
            this.indexOfCurrentQuestion = 0;

            do {
                this.indexOfCurrentQuestion = Math.floor(Math.random() * QUESTION_LIST.length);
            } while (this.indexesOfQuestionsUsed.includes(this.indexOfCurrentQuestion));
            this.indexesOfQuestionsUsed.push(this.indexOfCurrentQuestion);

            if (this.indexesOfQuestionsUsed.length === QUESTION_LIST.length) {
                this.indexesOfQuestionsUsed = [];
            }
        }

        protected async revealAnswer(): Promise<void> {
            clearInterval(this.randomJumpInterval);

            if (this.movieIsRight) {
                this.playerPoints += 2;
            }

            if (this.songIsRight) {
                this.playerPoints += 3;
            }

            this.message = (this.movieIsRight && this.songIsRight)
                ? 'Perfect! Well Done!'
                : this.movieIsRight || this.songIsRight
                    ? 'Good!'
                    : 'Sorry! Better luck next time!';

            await this.gameVideo.reveal();

            await this.playNextQuestion();
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

        protected get currentQuestion(): VideoQuestion {
            return QUESTION_LIST[this.indexOfCurrentQuestion];
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

        protected get messageColourClass(): string {
            if (this.secondsRemaining === 0) {
                return (this.movieIsRight || this.songIsRight) ? 'green--text text--darken-1' : 'red--text';
            }

            return 'light-blue--text text--darken-4';
        }

        protected get gameVideo(): GameVideo {
            // @ts-ignore
            return this.$refs.gameVideo;
        }

        protected get timer(): GameTimer {
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
        overflow: hidden;
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
