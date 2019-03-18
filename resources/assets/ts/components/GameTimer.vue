<template>
    <v-layout>
        <div v-text="value"></div>
    </v-layout>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'

    @Component
    export default class GameTimer extends Vue {
        @Prop() private value!: number;

        private interval: any;

        public start(): void {
            this.interval = setInterval(() => {
                if (this.value !== 0) {
                    const secondsRemaining: number = this.value - 1;
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


    }
</script>
