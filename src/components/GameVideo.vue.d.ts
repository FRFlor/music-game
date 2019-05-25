import { Vue } from 'vue-property-decorator';
import VideoPlayer from './VideoPlayer.vue';
import { VideoQuestion } from '@/interfaces';
export default class GameVideo extends Vue {
    protected size: number;
    protected questionData: VideoQuestion | null;
    protected videoDuration: number;
    protected readonly PLAY_MARGIN: number;
    protected isRevealed: boolean;
    protected readonly videoPlayer: VideoPlayer;
    public startQuestion(questionData: VideoQuestion): Promise<void>;
    public updateVideoSize(): Promise<void>;
    public reveal(): Promise<void>;
    public playRandomPoint(): Promise<void>;
    protected prepareQuestionToPlay(questionData: VideoQuestion): Promise<void>;
    protected volumeFadeIn(): Promise<void>;
    protected volumeFadeOut(): Promise<void>;
    protected volumeFade(delta: number): Promise<void>;
    protected wait(ms: number): Promise<void>;
}
