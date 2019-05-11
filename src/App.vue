<template>
    <div id="app">
        <game-video ref="gameVideo"
                    :question-data="currentQuestion"/>
        <button @click="playQuestion">Play playQuestion</button>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import GameVideo from '@/components/GameVideo.vue';
    import {QUESTION_LIST} from './storage/questionList';
    import {VideoQuestion} from '@/interfaces';

    @Component({ components: {
            GameVideo,
        } })
    export default class App extends Vue {
        protected currentQuestion: VideoQuestion = QUESTION_LIST[0];

        protected async playQuestion(): Promise<void> {
            const selectedIndex = Math.floor(Math.random() * QUESTION_LIST.length);
            this.currentQuestion = QUESTION_LIST[selectedIndex];
            await this.gameVideo.startQuestion(this.currentQuestion);
        }

        protected get gameVideo(): GameVideo {
            // @ts-ignore
            return this.$refs.gameVideo;
        }
    }
</script>

<style lang="scss" scoped>
</style>
