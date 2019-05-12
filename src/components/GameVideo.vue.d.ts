import { Vue } from 'vue-property-decorator';
import VideoPlayer from './VideoPlayer.vue';
import { VideoQuestion } from '@/interfaces';
export default class GameVideo extends Vue {
    size: number;
    protected questionData: VideoQuestion | null;
    protected videoDuration: number;
    protected readonly PLAY_MARGIN: number;
    protected isRevealed: boolean;
    startQuestion(questionData: VideoQuestion): Promise<void>;
    updateVideoSize(): Promise<void>;
    reveal(): Promise<void>;
    playRandomPoint(): Promise<void>;
    protected prepareQuestionToPlay(questionData: VideoQuestion): Promise<void>;
    protected volumeFadeIn(): Promise<void>;
    protected volumeFadeOut(): Promise<void>;
    protected volumeFade(delta: number): Promise<void>;
    protected readonly videoPlayer: VideoPlayer;
    protected wait(ms: number): Promise<void>;
}
