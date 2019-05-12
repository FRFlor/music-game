<template>
  <div id="app">
    <v-app id="musicgame">
      <v-container app fluid class="app-container">
        <v-layout wrap row>
          <v-flex>
            <game-video ref="gameVideo"
                        :question-data="currentQuestion"/>
          </v-flex>

          <v-flex>
            <v-btn @click="playQuestion">Play playQuestion</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-app>
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
