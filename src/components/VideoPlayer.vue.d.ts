import { Vue } from 'vue-property-decorator';
import { YoutubeAPI } from '../classes/YoutubeAPI';
export { YoutubeAPI };
export default class VideoPlayer extends Vue {
    protected videoId: string;
    protected isReady: boolean;
    selectVideo(videoId: string): Promise<void>;
    playVideo(): Promise<void>;
    stopVideo(): Promise<void>;
    setVolume(volume: number): Promise<void>;
    protected onVideoReady(): void;
    protected untilPlayerIsReady(): Promise<void>;
    protected readonly player: YoutubeAPI;
}
