import { Vue } from 'vue-property-decorator';
import VideoPlayer from './VideoPlayer.vue';
import { VideoQuestion } from '@/storage/questionList';
export default class GameVideo extends Vue {
    protected questionData: VideoQuestion | null;
    protected isRevealed: boolean;
    startQuestion(questionData: VideoQuestion): Promise<void>;
    volumeFadeIn(): Promise<void>;
    volumeFadeOut(): Promise<void>;
    protected volumeFade(delta: number): Promise<void>;
    protected readonly videoPlayer: VideoPlayer;
    protected wait(ms: number): Promise<void>;
}
