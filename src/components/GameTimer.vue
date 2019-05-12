<template>
    <v-progress-circular :value="progress"
                         :size="size"
                         width="12"
                         class="game-timer"
                         :color="timerColour">
        <slot>

        </slot>
    </v-progress-circular>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

    @Component
    export default class GameTimer extends Vue {
        @Prop() private value!: number;
        @Prop() private size!: number;
        @Prop({default: true}) private success!: boolean;

        private interval: any;
        private startValue: number = 0;
        private progress: number = 100;

        public start(): void {
            this.startValue = this.value;
            this.interval = setInterval(() => {
                if (this.value !== 0) {
                    const secondsRemaining: number = this.value - 1;
                    this.progress = 100 * secondsRemaining / this.startValue;
                    this.$emit('input', secondsRemaining);


                    if (secondsRemaining === 0) {
                        this.$emit('time-is-up');
                        this.progress = 100;
                        this.stop();
                    }
                }
            }, 1000);
        }

        public stop(): void {
            clearInterval(this.interval);
            this.interval = null;
        }

        public get isPlaying(): boolean {
            return !!this.interval;
        }

        protected get timerColour(): string {
            if (this.value > 10) {
                return 'light-blue darken-4';
            }

            if (this.value > 5) {
                return 'orange darken-4';
            }

            if (this.value > 0) {
                return 'red';
            }

            return this.success ? 'green' : 'red';
        }

        @Watch('size')
        protected onTimerSizeChanged(): void {
            document.documentElement.style.setProperty('--timer-size', `${this.size}px`);
        }

        protected created(): void {
            this.onTimerSizeChanged();
        }
    }
</script>

<style lang="scss" scoped>
    .game-timer {
        font-size: calc(var(--timer-size) * 0.25);
        font-family: Roboto, sans-serif;
    }
</style>
