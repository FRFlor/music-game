<template>
    <v-app id="musicgame" style="margin: 100px;">
        <v-layout>
            <v-flex>

            </v-flex>
        </v-layout>
        <game-timer ref="timer"
                    class="justify-center my-3"
                    :size="diameterOfTimer"
                    v-model="timerSeconds"
                    @time-is-up="revealAnswer">
            <div v-show="timerSeconds > 0">{{timerSeconds}}s</div>
            <game-video ref="gameVideo"
                        :size="videoPlayerSize"
                        :question-data="currentQuestion"/>
        </game-timer>

        <v-btn @click="playQuestion">Play playQuestion</v-btn>
    </v-app>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import GameVideo from '@/components/GameVideo.vue';
    import {QUESTION_LIST} from './storage/questionList';
    import {VideoQuestion} from '@/interfaces';
    import GameTimer from '@/components/GameTimer.vue';

    @Component({ components: {
            GameTimer,
            GameVideo,
        } })
    export default class App extends Vue {
        protected currentQuestion: VideoQuestion = QUESTION_LIST[0];
        protected timerSeconds: number = 5;
        protected readonly videoPlayerSize: number = 350;

        @Watch('videoPlayerSize')
        protected onVideoPlayerSizeChanged(): void {
            document.documentElement.style.setProperty('--video-size', `${this.videoPlayerSize}px`);
        }

        protected created(): void {
            this.onVideoPlayerSizeChanged();
        }

        protected async playQuestion(): Promise<void> {
            const selectedIndex = Math.floor(Math.random() * QUESTION_LIST.length);
            this.currentQuestion = QUESTION_LIST[selectedIndex];
            this.currentQuestion = QUESTION_LIST.find((question: VideoQuestion) => question.song === 'Friend Like Me') || QUESTION_LIST[0];

            this.timerSeconds = 5;
            await this.gameVideo.startQuestion(this.currentQuestion);
            this.timer.start();
        }

        protected async revealAnswer(): Promise<void> {
                await this.gameVideo.reveal();
        }

        protected get diameterOfTimer(): number {
            return Math.round(this.videoPlayerSize * 3/4);
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

</style>
