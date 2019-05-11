import { Vue } from 'vue-property-decorator';
import { YoutubeAPI } from '../interfaces/YoutubeAPI';
export { YoutubeAPI };
export default class VideoPlayer extends Vue implements YoutubeAPI {
    protected videoId: string;
    protected isReady: boolean;
    protected isPlaying: boolean;
    selectVideo(videoId: string): Promise<void>;
    playVideo(): Promise<void>;
    stopVideo(): Promise<void>;
    mute(): Promise<void>;
    unMute(): Promise<void>;
    isMuted(): Promise<void>;
    getVolume(): Promise<number>;
    getPlaybackRate(): Promise<void>;
    setPlaybackRate(suggestedRate: number): Promise<void>;
    getDuration(): Promise<number>;
    pauseVideo(): Promise<void>;
    seekTo(seconds: number, allowSeekAhead: boolean): Promise<void>;
    setVolume(volume: number): Promise<void>;
    protected pollUntilTrue(testee: boolean): Promise<void>;
    protected untilPlayerIsReady(): Promise<void>;
    protected untilVideoStartsPlaying(): Promise<void>;
    protected readonly player: YoutubeAPI;
}
