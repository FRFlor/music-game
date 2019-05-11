import { Vue } from 'vue-property-decorator';
import VideoPlayer from './VideoPlayer.vue';
import { VideoQuestion } from '@/storage/questionList';
export default class GameVideo extends Vue {
    protected questionData: VideoQuestion | null;
    protected isRevealed: boolean;
    startQuestion(questionData: VideoQuestion): Promise<void>;
    protected readonly videoPlayer: VideoPlayer;
}
