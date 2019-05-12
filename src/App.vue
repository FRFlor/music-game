<template>
    <v-app id="musicgame">
        <v-container app class="music-game">
            <!--Scoreboard-->
            <span v-text="`Your score: ${playerPoints}`"
                  class="headline light-blue--text text--darken-1 mb-4"></span>

            <!--Movie Answer Input-->
            <v-autocomplete
                    v-model="movieAnswer"
                    :items="movies"
                    label="What movie is this song from?"
                    :readonly="timerSeconds === 0"
                    :success="timerSeconds === 0 && movieIsRight"
                    :error="timerSeconds === 0 && ! movieIsRight"
                    prepend-icon="fas fa-film"
            ></v-autocomplete>

            <!--Timer and Video-->
            <game-timer ref="timer"
                        class="my-3"
                        :size="diameterOfTimer"
                        v-model="timerSeconds"
                        @time-is-up="revealAnswer">
                <div v-show="timerSeconds > 0">{{timerSeconds}}s</div>
                <game-video ref="gameVideo"
                            :size="videoPlayerSize"
                            :question-data="currentQuestion"/>
            </game-timer>

            <!--Messages-->
            <div class="messages">
                <div v-if="loadingMessage.length > 0"
                     class="text-xs-center light-blue--text text--darken-4"
                     v-text="loadingMessage"></div>
                <div v-else-if="timerSeconds === 0">
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
                    v-model="songAnswer"
                    :items="songs"
                    label="What song is this?"
                    prepend-icon="fas fa-music"
                    :readonly="timerSeconds === 0"
                    :success="timerSeconds === 0 && songIsRight"
                    :error="timerSeconds === 0 && ! songIsRight"
            ></v-autocomplete>

            <!--Skip to Result-->
            <v-btn color="light-green darken-1"
                   @click="playQuestion"
                   v-if="! gameHasStarted"
                   outline
                   round large>
                Start
            </v-btn>
            <v-btn v-else
                   color="light-blue darken-1"
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
        }
    })
    export default class App extends Vue {
        protected currentQuestion: VideoQuestion = QUESTION_LIST[0];
        protected readonly TIME_PER_QUESTION: number = 10;
        protected timerSeconds: number = this.TIME_PER_QUESTION;
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
            const selectedIndex = Math.floor(Math.random() * QUESTION_LIST.length);
            this.currentQuestion = QUESTION_LIST[selectedIndex];
            // this.currentQuestion = QUESTION_LIST
            // .find((question: VideoQuestion) => question.song === 'Let It Go') || QUESTION_LIST[0];

            this.timerSeconds = this.TIME_PER_QUESTION;
            this.loadingMessage = 'Loading video...';
            await this.gameVideo.startQuestion(this.currentQuestion);
            this.loadingMessage = '';
            this.timer.start();
        }

        protected async revealAnswer(): Promise<void> {
            if (this.movieAnswer === this.currentQuestion.movie) {
                this.playerPoints += 2;
            }

            if (this.songAnswer === this.currentQuestion.song) {
                this.playerPoints += 3;
            }

            await this.gameVideo.reveal();
        }

        protected get diameterOfTimer(): number {
            return Math.round(this.videoPlayerSize * 0.65);
        }

        protected skipToAnswer(): void {
            if (this.timerSeconds > 3) {
                this.timerSeconds = 3;
            }
        }

        protected get canSkip(): boolean {
            return this.timerSeconds > 3 && this.TIME_PER_QUESTION - this.timerSeconds > 3;
        }

        private get movieIsRight(): boolean {
            return this.movieAnswer === this.currentQuestion.movie;
        }

        private get songIsRight(): boolean {
            return this.songAnswer === this.currentQuestion.song;
        }

        private get movies(): string[] {
            return QUESTION_LIST.map((question: VideoQuestion) => question.movie).sort();
        }

        private get songs(): string[] {
            return QUESTION_LIST.map((question: VideoQuestion) => question.song).sort();
        }

        private get resultMessage(): string {
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
    }
</style>
