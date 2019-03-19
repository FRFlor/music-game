<template>
    <v-layout>
        <v-progress-circular :value="progress"
                             size="120"
                             width="10"
                             :color="timerColour"
                             class="title">
            {{value}}s
        </v-progress-circular>

    </v-layout>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'

    @Component
    export default class GameTimer extends Vue {
        @Prop() private value!: number;

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
                    }
                }
            }, 1000);
        }

        public stop(): void {
            clearInterval(this.interval);
            this.interval = null;
        }

        private get timerColour(): string {
            if (this.value > 10) {
                return "light-blue darken-4";
            }

            return this.value > 5 ? "orange darken-4" : "red";
        }
    }
</script>

<style lang="scss" scoped>
    .circular-progress {

    }
</style>
